const mongoose = require("mongoose");

const Interview = require("../models/Interview");
const Application = require("../models/Application");
const Job = require("../models/Job");

const createNotification = require("../utils/createNotification");

// ============================================
// HELPERS
// ============================================

const isAdmin = (user) => {
  return ["ADMIN", "SUPER_ADMIN"].includes(
    user.role,
  );
};

const isRecruiter = (user) => {
  return user.role === "RECRUITER";
};

const isValidObjectId = (id) => {
  return mongoose.isValidObjectId(id);
};

const isValidHttpUrl = (value) => {
  if (!value) {
    return true;
  }

  if (typeof value !== "string") {
    return false;
  }

  try {
    const url = new URL(value);

    return (
      url.protocol === "http:" ||
      url.protocol === "https:"
    );
  } catch {
    return false;
  }
};

const getPagination = (query) => {
  const page = Math.max(
    1,
    parseInt(query.page, 10) || 1,
  );

  const limit = Math.min(
    50,
    Math.max(
      1,
      parseInt(query.limit, 10) || 20,
    ),
  );

  return {
    page,
    limit,
    skip: (page - 1) * limit,
  };
};

// ============================================
// CREATE INTERVIEW
// POST /api/interviews
// ============================================

const createInterview = async (
  req,
  res,
  next,
) => {
  try {
    const {
      applicationId,
      scheduledAt,
      duration,
      type,
      meetingLink,
      location,
      interviewerName,
      interviewerEmail,
      notes,
    } = req.body || {};

    // ==========================================
    // VALIDATION
    // ==========================================

    if (
      !applicationId ||
      !isValidObjectId(applicationId)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "A valid applicationId is required.",
      });
    }

    if (!scheduledAt) {
      return res.status(400).json({
        success: false,
        message:
          "Interview date and time are required.",
      });
    }

    const interviewDate = new Date(scheduledAt);

    if (Number.isNaN(interviewDate.getTime())) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid interview date and time.",
      });
    }

    if (interviewDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message:
          "Interview must be scheduled for a future date and time.",
      });
    }

    const interviewDuration =
      duration === undefined
        ? 30
        : Number(duration);

    if (
      !Number.isInteger(interviewDuration) ||
      interviewDuration < 15 ||
      interviewDuration > 480
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Interview duration must be between 15 and 480 minutes.",
      });
    }

    const allowedTypes = [
      "VIDEO",
      "PHONE",
      "IN_PERSON",
    ];

    const interviewType = type
      ? String(type).trim().toUpperCase()
      : "VIDEO";

    if (!allowedTypes.includes(interviewType)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid interview type.",
      });
    }

    if (
      meetingLink &&
      !isValidHttpUrl(meetingLink)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Meeting link must be a valid HTTP or HTTPS URL.",
      });
    }

    if (
      interviewType === "VIDEO" &&
      !meetingLink
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Meeting link is required for video interviews.",
      });
    }

    if (
      interviewType === "IN_PERSON" &&
      !location
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Location is required for in-person interviews.",
      });
    }

    // ==========================================
    // FIND APPLICATION
    // ==========================================

    const application =
      await Application.findById(
        applicationId,
      );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    // ==========================================
    // FIND JOB
    // ==========================================

    const job = await Job.findById(
      application.job,
    ).select(
      "_id title companyName createdBy status",
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message:
          "Associated job not found.",
      });
    }

    // ==========================================
    // PERMISSION CHECK
    // ==========================================

    const ownsJob =
      job.createdBy.toString() ===
      req.user._id.toString();

    if (
      !ownsJob &&
      !isAdmin(req.user)
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You cannot schedule an interview for this job.",
      });
    }

    // ==========================================
    // APPLICATION STATUS CHECK
    // ==========================================

    if (
      ![
        "REVIEWING",
        "SHORTLISTED",
      ].includes(application.status)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Interview can only be scheduled for applications under review or shortlisted.",
      });
    }

    // ==========================================
    // DUPLICATE / CONFLICT CHECK
    // ==========================================

    const existingInterview =
      await Interview.findOne({
        application: application._id,
        scheduledAt: interviewDate,
        status: {
          $ne: "CANCELLED",
        },
      });

    if (existingInterview) {
      return res.status(409).json({
        success: false,
        message:
          "An interview is already scheduled at this time.",
      });
    }

    // ==========================================
    // CREATE INTERVIEW
    // ==========================================

    const interview =
      await Interview.create({
        application:
          application._id,

        job: job._id,

        applicant:
          application.applicant,

        recruiter:
          req.user._id,

        title:
          job.title || "Interview",

        scheduledAt: interviewDate,

        duration:
          interviewDuration,

        type: interviewType,

        meetingLink:
          meetingLink
            ? meetingLink.trim()
            : "",

        location:
          location
            ? location.trim()
            : "",

        interviewerName:
          interviewerName
            ? interviewerName.trim()
            : "",

        interviewerEmail:
          interviewerEmail
            ? interviewerEmail
                .trim()
                .toLowerCase()
            : "",

        notes:
          notes
            ? notes.trim()
            : "",
      });

    // ==========================================
    // UPDATE APPLICATION STATUS
    // ==========================================

    if (
      application.status !==
      "SHORTLISTED"
    ) {
      application.status =
        "SHORTLISTED";

      await application.save();
    }

    // ==========================================
    // NOTIFICATION
    // ==========================================

    try {
      const formattedDate =
        interviewDate.toLocaleString(
          "en-IN",
          {
            dateStyle: "medium",
            timeStyle: "short",
          },
        );

      await createNotification({
        recipient:
          application.applicant,

        type: "INTERVIEW",

        title:
          "Interview scheduled",

        message: `Your interview for ${
          job.title
        } has been scheduled for ${formattedDate}.`,

        link:
          "/dashboard/interviews",

        relatedApplication:
          application._id,

        relatedJob:
          job._id,
      });
    } catch (notificationError) {
      console.error(
        "Interview notification creation failed:",
        notificationError.message,
      );
    }

    // ==========================================
    // RESPONSE
    // ==========================================

    const populatedInterview =
      await Interview.findById(
        interview._id,
      )
        .populate(
          "job",
          "title companyName location",
        )
        .populate(
          "applicant",
          "name email",
        )
        .populate(
          "application",
          "status",
        )
        .lean();

    return res.status(201).json({
      success: true,
      message:
        "Interview scheduled successfully.",
      data: populatedInterview,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// GET MY INTERVIEWS
// GET /api/interviews/my
// ============================================

const getMyInterviews = async (
  req,
  res,
  next,
) => {
  try {
    const {
      page,
      limit,
      skip,
    } = getPagination(req.query);

    const filter = {
      applicant: req.user._id,
    };

    if (req.query.status) {
      const status = String(
        req.query.status,
      )
        .trim()
        .toUpperCase();

      if (
        ![
          "SCHEDULED",
          "COMPLETED",
          "CANCELLED",
        ].includes(status)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid interview status.",
        });
      }

      filter.status = status;
    }

    const [
      interviews,
      total,
    ] = await Promise.all([
      Interview.find(filter)
        .populate(
          "job",
          "title companyName location",
        )
        .populate(
          "recruiter",
          "name email",
        )
        .populate(
          "application",
          "status",
        )
        .sort({
          scheduledAt: 1,
        })
        .skip(skip)
        .limit(limit)
        .lean(),

      Interview.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,

      data: interviews,

      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(
          total / limit,
        ),
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// GET RECRUITER INTERVIEWS
// GET /api/interviews/recruiter
// ============================================

const getRecruiterInterviews = async (
  req,
  res,
  next,
) => {
  try {
    if (
      !isRecruiter(req.user) &&
      !isAdmin(req.user)
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to view recruiter interviews.",
      });
    }

    const {
      page,
      limit,
      skip,
    } = getPagination(req.query);

    const filter = {};

    if (isRecruiter(req.user)) {
      filter.recruiter =
        req.user._id;
    }

    if (req.query.status) {
      const status = String(
        req.query.status,
      )
        .trim()
        .toUpperCase();

      if (
        ![
          "SCHEDULED",
          "COMPLETED",
          "CANCELLED",
        ].includes(status)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid interview status.",
        });
      }

      filter.status = status;
    }

    const [
      interviews,
      total,
    ] = await Promise.all([
      Interview.find(filter)
        .populate(
          "job",
          "title companyName location",
        )
        .populate(
          "applicant",
          "name email phone",
        )
        .populate(
          "application",
          "status",
        )
        .sort({
          scheduledAt: 1,
        })
        .skip(skip)
        .limit(limit)
        .lean(),

      Interview.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,

      data: interviews,

      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(
          total / limit,
        ),
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// UPDATE INTERVIEW
// PATCH /api/interviews/:id
// ============================================

const updateInterview = async (
  req,
  res,
  next,
) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid interview ID.",
      });
    }

    const interview =
      await Interview.findById(id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message:
          "Interview not found.",
      });
    }

    const ownsInterview =
      interview.recruiter.toString() ===
      req.user._id.toString();

    if (
      !ownsInterview &&
      !isAdmin(req.user)
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You cannot update this interview.",
      });
    }

    if (
      interview.status ===
        "CANCELLED" &&
      req.body.status !==
        "SCHEDULED"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Cancelled interviews cannot be updated.",
      });
    }

    const {
      scheduledAt,
      duration,
      type,
      meetingLink,
      location,
      interviewerName,
      interviewerEmail,
      notes,
      status,
    } = req.body || {};

    // ==========================================
    // DATE
    // ==========================================

    if (scheduledAt !== undefined) {
      const newDate =
        new Date(scheduledAt);

      if (
        Number.isNaN(
          newDate.getTime(),
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid interview date.",
        });
      }

      if (
        status !== "COMPLETED" &&
        status !== "CANCELLED" &&
        newDate <= new Date()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Interview must be scheduled for a future date.",
        });
      }

      interview.scheduledAt =
        newDate;
    }

    // ==========================================
    // DURATION
    // ==========================================

    if (duration !== undefined) {
      const newDuration =
        Number(duration);

      if (
        !Number.isInteger(
          newDuration,
        ) ||
        newDuration < 15 ||
        newDuration > 480
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Duration must be between 15 and 480 minutes.",
        });
      }

      interview.duration =
        newDuration;
    }

    // ==========================================
    // TYPE
    // ==========================================

    if (type !== undefined) {
      const normalizedType =
        String(type)
          .trim()
          .toUpperCase();

      if (
        ![
          "VIDEO",
          "PHONE",
          "IN_PERSON",
        ].includes(normalizedType)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid interview type.",
        });
      }

      interview.type =
        normalizedType;
    }

    // ==========================================
    // MEETING LINK
    // ==========================================

    if (
      meetingLink !== undefined
    ) {
      if (
        meetingLink &&
        !isValidHttpUrl(
          meetingLink,
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid meeting link.",
        });
      }

      interview.meetingLink =
        meetingLink
          ? meetingLink.trim()
          : "";
    }

    // ==========================================
    // LOCATION
    // ==========================================

    if (
      location !== undefined
    ) {
      interview.location =
        location
          ? location.trim()
          : "";
    }

    // ==========================================
    // INTERVIEWER
    // ==========================================

    if (
      interviewerName !==
      undefined
    ) {
      interview.interviewerName =
        interviewerName
          ? interviewerName.trim()
          : "";
    }

    if (
      interviewerEmail !==
      undefined
    ) {
      interview.interviewerEmail =
        interviewerEmail
          ? interviewerEmail
              .trim()
              .toLowerCase()
          : "";
    }

    // ==========================================
    // NOTES
    // ==========================================

    if (notes !== undefined) {
      if (
        typeof notes !==
        "string"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Notes must be a string.",
        });
      }

      if (notes.length > 3000) {
        return res.status(400).json({
          success: false,
          message:
            "Notes cannot exceed 3000 characters.",
        });
      }

      interview.notes =
        notes.trim();
    }

    // ==========================================
    // STATUS
    // ==========================================

    if (status !== undefined) {
      const normalizedStatus =
        String(status)
          .trim()
          .toUpperCase();

      if (
        ![
          "SCHEDULED",
          "COMPLETED",
          "CANCELLED",
        ].includes(
          normalizedStatus,
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid interview status.",
        });
      }

      if (
        normalizedStatus ===
        "COMPLETED"
      ) {
        interview.completedAt =
          new Date();
      }

      if (
        normalizedStatus ===
        "CANCELLED"
      ) {
        interview.cancellationReason =
          req.body.cancellationReason
            ? String(
                req.body
                  .cancellationReason,
              ).trim()
            : "";
      }

      interview.status =
        normalizedStatus;
    }

    await interview.save();

    // ==========================================
    // NOTIFICATION
    // ==========================================

    try {
      let notificationTitle = "";
      let notificationMessage = "";

      if (
        interview.status ===
        "CANCELLED"
      ) {
        notificationTitle =
          "Interview cancelled";

        notificationMessage =
          "Your scheduled interview has been cancelled.";
      } else if (
        interview.status ===
        "COMPLETED"
      ) {
        notificationTitle =
          "Interview completed";

        notificationMessage =
          "Your interview has been marked as completed.";
      } else {
        notificationTitle =
          "Interview updated";

        notificationMessage =
          "Your interview details have been updated.";
      }

      await createNotification({
        recipient:
          interview.applicant,

        type: "INTERVIEW",

        title:
          notificationTitle,

        message:
          notificationMessage,

        link:
          "/dashboard/interviews",

        relatedApplication:
          interview.application,

        relatedJob:
          interview.job,
      });
    } catch (notificationError) {
      console.error(
        "Interview update notification failed:",
        notificationError.message,
      );
    }

    const updatedInterview =
      await Interview.findById(
        interview._id,
      )
        .populate(
          "job",
          "title companyName location",
        )
        .populate(
          "applicant",
          "name email",
        )
        .populate(
          "application",
          "status",
        )
        .lean();

    return res.status(200).json({
      success: true,
      message:
        "Interview updated successfully.",
      data: updatedInterview,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// DELETE / CANCEL INTERVIEW
// DELETE /api/interviews/:id
// ============================================

const deleteInterview = async (
  req,
  res,
  next,
) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid interview ID.",
      });
    }

    const interview =
      await Interview.findById(id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message:
          "Interview not found.",
      });
    }

    const ownsInterview =
      interview.recruiter.toString() ===
      req.user._id.toString();

    if (
      !ownsInterview &&
      !isAdmin(req.user)
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You cannot cancel this interview.",
      });
    }

    if (
      interview.status ===
      "COMPLETED"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Completed interviews cannot be cancelled.",
      });
    }

    interview.status =
      "CANCELLED";

    interview.cancellationReason =
      req.body?.reason
        ? String(
            req.body.reason,
          ).trim()
        : "";

    await interview.save();

    // ==========================================
    // NOTIFICATION
    // ==========================================

    try {
      await createNotification({
        recipient:
          interview.applicant,

        type: "INTERVIEW",

        title:
          "Interview cancelled",

        message:
          "Your scheduled interview has been cancelled.",

        link:
          "/dashboard/interviews",

        relatedApplication:
          interview.application,

        relatedJob:
          interview.job,
      });
    } catch (notificationError) {
      console.error(
        "Interview cancellation notification failed:",
        notificationError.message,
      );
    }

    return res.status(200).json({
      success: true,
      message:
        "Interview cancelled successfully.",
      data: interview,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createInterview,
  getMyInterviews,
  getRecruiterInterviews,
  updateInterview,
  deleteInterview,
};