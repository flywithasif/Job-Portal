import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Check,
  Loader2,
  Search,
  Users,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  getJobApplications,
  updateApplicationStatus,
} from "../../services/applicationService";

import {
  getMyJobs,
} from "../../services/jobService";

import {
  createInterview,
} from "../../services/interviewService";

const STATUS_OPTIONS = [
  "PENDING",
  "REVIEWING",
  "SHORTLISTED",
  "REJECTED",
  "ACCEPTED",
];

const STATUS_STYLES = {
  PENDING: "bg-blue-50 text-blue-700",
  REVIEWING: "bg-amber-50 text-amber-700",
  SHORTLISTED: "bg-violet-50 text-violet-700",
  REJECTED: "bg-red-50 text-red-700",
  ACCEPTED: "bg-emerald-50 text-emerald-700",
};

function formatEnum(value) {
  if (!value) return "—";

  return String(value)
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getApplicantName(application) {
  return (
    application?.applicant?.name ||
    application?.user?.name ||
    "Unknown applicant"
  );
}

function getApplicantEmail(application) {
  return (
    application?.applicant?.email ||
    application?.user?.email ||
    "No email available"
  );
}

function getApplicantSkills(application) {
  const skills =
    application?.applicant?.skills ||
    application?.user?.skills ||
    [];

  return Array.isArray(skills)
    ? skills
    : [];
}

function getJobTitle(application) {
  return (
    application?.job?.title ||
    "Job not available"
  );
}

function getJobId(application) {
  return (
    application?.job?._id ||
    application?.job?.id ||
    application?.job
  );
}

function normalizeApplication(application) {
  return {
    ...application,
    id:
      application?._id ||
      application?.id,

    name: getApplicantName(application),

    email: getApplicantEmail(application),

    job: getJobTitle(application),

    jobId: getJobId(application),

    skills: getApplicantSkills(application),

    resumeUrl:
      application?.resumeUrl ||
      application?.applicant?.resumeUrl ||
      "",

    coverLetter:
      application?.coverLetter || "",

    phone:
      application?.applicant?.phone ||
      "",

    headline:
      application?.applicant?.headline ||
      "",

    location:
      application?.applicant?.location ||
      "",

    status:
      application?.status ||
      "PENDING",

    appliedOn:
      application?.createdAt ||
      null,
  };
}

function getApiErrorMessage(error, fallback) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    fallback
  );
}

function getInitials(name = "") {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "A"
  );
}

export default function Applicants() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] =
    useState([]);

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] =
    useState(null);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [jobFilter, setJobFilter] =
    useState("All jobs");

  const [selectedApplicant, setSelectedApplicant] =
    useState(null);

  const [interviewApplicant, setInterviewApplicant] =
    useState(null);

  const [interviewSaving, setInterviewSaving] =
    useState(false);

  const [interviewForm, setInterviewForm] =
    useState({
      date: "",
      time: "",
      duration: "30",
      type: "VIDEO",
      meetingLink: "",
      location: "",
      notes: "",
    });

  async function loadData() {
    try {
      setLoading(true);

      const jobsResponse = await getMyJobs({
        page: 1,
        limit: 100,
      });

      const recruiterJobs = Array.isArray(
        jobsResponse?.data,
      )
        ? jobsResponse.data
        : [];

      setJobs(recruiterJobs);

      const applicationResults =
        await Promise.all(
          recruiterJobs.map(async (job) => {
            const jobId =
              job?._id || job?.id;

            if (!jobId) return [];

            try {
              const response =
                await getJobApplications(
                  jobId,
                  {
                    page: 1,
                    limit: 100,
                  },
                );

              return Array.isArray(
                response?.data,
              )
                ? response.data
                : [];
            } catch {
              return [];
            }
          }),
        );

      setApplications(
        applicationResults
          .flat()
          .map(normalizeApplication),
      );
    } catch (error) {
      setApplications([]);

      toast.error(
        getApiErrorMessage(
          error,
          "Unable to load applicants.",
        ),
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const filteredApplications = useMemo(() => {
    const query =
      searchQuery.trim().toLowerCase();

    return applications.filter(
      (application) => {
        const matchesStatus =
          statusFilter === "All" ||
          application.status === statusFilter;

        const matchesJob =
          jobFilter === "All jobs" ||
          String(application.jobId) ===
            String(jobFilter);

        const searchableValues = [
          application.name,
          application.email,
          application.job,
          application.headline,
          application.location,
          ...application.skills,
        ];

        const matchesSearch =
          !query ||
          searchableValues.some((value) =>
            String(value || "")
              .toLowerCase()
              .includes(query),
          );

        return (
          matchesStatus &&
          matchesJob &&
          matchesSearch
        );
      },
    );
  }, [
    applications,
    statusFilter,
    jobFilter,
    searchQuery,
  ]);

  const stats = useMemo(
    () => ({
      total: applications.length,

      shortlisted: applications.filter(
        (item) =>
          item.status === "SHORTLISTED",
      ).length,

      reviewing: applications.filter(
        (item) =>
          item.status === "REVIEWING",
      ).length,

      hired: applications.filter(
        (item) =>
          item.status === "ACCEPTED",
      ).length,
    }),
    [applications],
  );

  async function handleStatusChange(
    applicationId,
    status,
  ) {
    try {
      setUpdatingId(applicationId);

      const response =
        await updateApplicationStatus(
          applicationId,
          status,
        );

      const updated =
        normalizeApplication(
          response?.data,
        );

      setApplications((current) =>
        current.map((item) =>
          item.id === applicationId
            ? {
                ...item,
                ...updated,
              }
            : item,
        ),
      );

      setSelectedApplicant((current) =>
        current?.id === applicationId
          ? {
              ...current,
              ...updated,
            }
          : current,
      );

      toast.success(
        "Application status updated successfully.",
      );
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          "Unable to update application status.",
        ),
      );
    } finally {
      setUpdatingId(null);
    }
  }

  function openInterviewModal(application) {
    if (
      !["REVIEWING", "SHORTLISTED"].includes(
        application.status,
      )
    ) {
      toast.error(
        "Move the candidate to Reviewing or Shortlisted before scheduling an interview.",
      );
      return;
    }

    setInterviewApplicant(application);

    setInterviewForm({
      date: "",
      time: "",
      duration: "30",
      type: "VIDEO",
      meetingLink: "",
      location: "",
      notes: "",
    });
  }

  async function handleScheduleInterview(
    event,
  ) {
    event.preventDefault();

    if (!interviewApplicant) return;

    if (
      !interviewForm.date ||
      !interviewForm.time
    ) {
      toast.error(
        "Please select interview date and time.",
      );
      return;
    }

    if (
      interviewForm.type === "VIDEO" &&
      !interviewForm.meetingLink.trim()
    ) {
      toast.error(
        "Meeting link is required for a video interview.",
      );
      return;
    }

    if (
      interviewForm.type === "IN_PERSON" &&
      !interviewForm.location.trim()
    ) {
      toast.error(
        "Location is required for an in-person interview.",
      );
      return;
    }

    const scheduledAt = new Date(
      `${interviewForm.date}T${interviewForm.time}`,
    );

    if (
      Number.isNaN(scheduledAt.getTime()) ||
      scheduledAt <= new Date()
    ) {
      toast.error(
        "Interview must be scheduled for a future date and time.",
      );
      return;
    }

    try {
      setInterviewSaving(true);

      await createInterview({
        application:
          interviewApplicant.id,

        job: interviewApplicant.jobId,

        applicant:
          interviewApplicant.applicant?._id ||
          interviewApplicant.applicant?.id,

        title: `Interview - ${interviewApplicant.job}`,

        scheduledAt:
          scheduledAt.toISOString(),

        duration: Number(
          interviewForm.duration,
        ),

        type: interviewForm.type,

        meetingLink:
          interviewForm.meetingLink.trim(),

        location:
          interviewForm.location.trim(),

        interviewerName: "",

        interviewerEmail: "",

        notes:
          interviewForm.notes.trim(),
      });

      toast.success(
        "Interview scheduled successfully.",
      );

      setInterviewApplicant(null);
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          "Unable to schedule interview.",
        ),
      );
    } finally {
      setInterviewSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-7 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold tracking-[0.18em] text-blue-700">
              RECRUITER WORKSPACE
            </p>

            <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
              Applicants
            </h1>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Review candidates, update application
              status and schedule interviews.
            </p>
          </div>
        </div>

        {/* Stats */}
        <section className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            [
              "Total applicants",
              stats.total,
              Users,
              "bg-blue-50 text-blue-700",
            ],
            [
              "Under review",
              stats.reviewing,
              Search,
              "bg-amber-50 text-amber-700",
            ],
            [
              "Shortlisted",
              stats.shortlisted,
              Check,
              "bg-violet-50 text-violet-700",
            ],
            [
              "Hired",
              stats.hired,
              Check,
              "bg-emerald-50 text-emerald-700",
            ],
          ].map(
            ([
              label,
              value,
              Icon,
              color,
            ]) => (
              <div
                key={label}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">
                    {label}
                  </p>

                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}
                  >
                    <Icon size={18} />
                  </span>
                </div>

                <p className="mt-4 text-3xl font-black text-[#172b4d]">
                  {value}
                </p>
              </div>
            ),
          )}
        </section>

        {/* Filters */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 lg:grid-cols-[1fr_220px_220px]">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(
                    event.target.value,
                  )
                }
                placeholder="Search candidate, email, job or skill..."
                className="h-11 w-full rounded-xl border border-slate-200 pl-10 pr-3 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value,
                )
              }
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium outline-none focus:border-blue-400"
            >
              <option value="All">
                All statuses
              </option>

              {STATUS_OPTIONS.map((status) => (
                <option
                  key={status}
                  value={status}
                >
                  {formatEnum(status)}
                </option>
              ))}
            </select>

            <select
              value={jobFilter}
              onChange={(event) =>
                setJobFilter(
                  event.target.value,
                )
              }
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium outline-none focus:border-blue-400"
            >
              <option value="All jobs">
                All jobs
              </option>

              {jobs.map((job) => (
                <option
                  key={job._id || job.id}
                  value={job._id || job.id}
                >
                  {job.title}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Applicants Table */}
        <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="flex min-h-64 items-center justify-center gap-3 text-slate-500">
              <Loader2
                size={20}
                className="animate-spin"
              />
              Loading applicants...
            </div>
          ) : filteredApplications.length ===
            0 ? (
            <div className="p-12 text-center">
              <Users
                size={35}
                className="mx-auto text-slate-300"
              />

              <h3 className="mt-4 font-bold text-slate-700">
                No applicants found
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                Applications will appear here when
                candidates apply to your jobs.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-5 py-4">
                      Candidate
                    </th>

                    <th className="px-5 py-4">
                      Job
                    </th>

                    <th className="px-5 py-4">
                      Skills
                    </th>

                    <th className="px-5 py-4">
                      Applied
                    </th>

                    <th className="px-5 py-4">
                      Status
                    </th>

                    <th className="px-5 py-4">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredApplications.map(
                    (application) => (
                      <tr
                        key={application.id}
                        className="hover:bg-slate-50/70"
                      >
                        <td className="px-5 py-5">
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedApplicant(
                                application,
                              )
                            }
                            className="flex items-center gap-3 text-left"
                          >
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-700">
                              {getInitials(
                                application.name,
                              )}
                            </span>

                            <span>
                              <span className="block font-bold text-slate-900">
                                {application.name}
                              </span>

                              <span className="mt-1 block text-xs text-slate-500">
                                {application.email}
                              </span>
                            </span>
                          </button>
                        </td>

                        <td className="px-5 py-5">
                          <p className="font-semibold text-slate-800">
                            {application.job}
                          </p>

                          {application.location && (
                            <p className="mt-1 text-xs text-slate-400">
                              {application.location}
                            </p>
                          )}
                        </td>

                        <td className="px-5 py-5">
                          <div className="flex max-w-64 flex-wrap gap-1.5">
                            {application.skills
                              .slice(0, 5)
                              .map((skill) => (
                                <span
                                  key={skill}
                                  className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600"
                                >
                                  {skill}
                                </span>
                              ))}
                          </div>
                        </td>

                        <td className="px-5 py-5 text-sm text-slate-500">
                          {formatDate(
                            application.appliedOn,
                          )}
                        </td>

                        <td className="px-5 py-5">
                          <span
                            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                              STATUS_STYLES[
                                application.status
                              ] ||
                              STATUS_STYLES.PENDING
                            }`}
                          >
                            {formatEnum(
                              application.status,
                            )}
                          </span>
                        </td>

                        <td className="px-5 py-5">
                          <div className="flex items-center gap-2">
                            <select
                              value={
                                application.status
                              }
                              disabled={
                                updatingId ===
                                application.id
                              }
                              onChange={(event) =>
                                handleStatusChange(
                                  application.id,
                                  event.target.value,
                                )
                              }
                              className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-xs font-semibold outline-none focus:border-blue-400 disabled:opacity-50"
                            >
                              {STATUS_OPTIONS.map(
                                (status) => (
                                  <option
                                    key={status}
                                    value={status}
                                  >
                                    {formatEnum(
                                      status,
                                    )}
                                  </option>
                                ),
                              )}
                            </select>

                            <button
                              type="button"
                              onClick={() =>
                                openInterviewModal(
                                  application,
                                )
                              }
                              title="Schedule interview"
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-blue-700 hover:bg-blue-100"
                            >
                              <CalendarDays
                                size={16}
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* Candidate Modal */}
      {selectedApplicant && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="font-bold text-[#172b4d]">
                  Candidate profile
                </h2>

                <p className="text-xs text-slate-500">
                  {selectedApplicant.job}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedApplicant(null)
                }
                className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-6 p-5 sm:p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-xl font-bold text-blue-700">
                  {getInitials(
                    selectedApplicant.name,
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {selectedApplicant.name}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {selectedApplicant.email}
                  </p>

                  {selectedApplicant.phone && (
                    <p className="mt-1 text-sm text-slate-500">
                      {selectedApplicant.phone}
                    </p>
                  )}
                </div>
              </div>

              {selectedApplicant.headline && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Headline
                  </p>

                  <p className="mt-2 text-sm text-slate-700">
                    {selectedApplicant.headline}
                  </p>
                </div>
              )}

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Skills
                </p>

                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedApplicant.skills.length >
                  0 ? (
                    selectedApplicant.skills.map(
                      (skill) => (
                        <span
                          key={skill}
                          className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600"
                        >
                          {skill}
                        </span>
                      ),
                    )
                  ) : (
                    <span className="text-sm text-slate-400">
                      No skills listed.
                    </span>
                  )}
                </div>
              </div>

              {selectedApplicant.coverLetter && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Cover letter
                  </p>

                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                    {selectedApplicant.coverLetter}
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                {selectedApplicant.resumeUrl && (
                  <a
                    href={
                      selectedApplicant.resumeUrl
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl bg-[#0066b3] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#005596]"
                  >
                    View Resume
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setSelectedApplicant(null);
                    openInterviewModal(
                      selectedApplicant,
                    );
                  }}
                  className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-bold text-blue-700 hover:bg-blue-100"
                >
                  <CalendarDays size={16} />
                  Schedule Interview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interview Modal */}
      {interviewApplicant && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="font-bold text-[#172b4d]">
                  Schedule interview
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  {interviewApplicant.name} ·{" "}
                  {interviewApplicant.job}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setInterviewApplicant(null)
                }
                className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={handleScheduleInterview}
              className="space-y-5 p-5 sm:p-6"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <label>
                  <span className="text-sm font-semibold text-slate-700">
                    Date
                  </span>

                  <input
                    type="date"
                    value={interviewForm.date}
                    min={
                      new Date()
                        .toISOString()
                        .slice(0, 10)
                    }
                    onChange={(event) =>
                      setInterviewForm(
                        (current) => ({
                          ...current,
                          date: event.target
                            .value,
                        }),
                      )
                    }
                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-400"
                  />
                </label>

                <label>
                  <span className="text-sm font-semibold text-slate-700">
                    Time
                  </span>

                  <input
                    type="time"
                    value={interviewForm.time}
                    onChange={(event) =>
                      setInterviewForm(
                        (current) => ({
                          ...current,
                          time: event.target
                            .value,
                        }),
                      )
                    }
                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-400"
                  />
                </label>

                <label>
                  <span className="text-sm font-semibold text-slate-700">
                    Duration
                  </span>

                  <select
                    value={
                      interviewForm.duration
                    }
                    onChange={(event) =>
                      setInterviewForm(
                        (current) => ({
                          ...current,
                          duration:
                            event.target.value,
                        }),
                      )
                    }
                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-400"
                  >
                    <option value="15">
                      15 minutes
                    </option>
                    <option value="30">
                      30 minutes
                    </option>
                    <option value="45">
                      45 minutes
                    </option>
                    <option value="60">
                      60 minutes
                    </option>
                    <option value="90">
                      90 minutes
                    </option>
                  </select>
                </label>

                <label>
                  <span className="text-sm font-semibold text-slate-700">
                    Interview type
                  </span>

                  <select
                    value={interviewForm.type}
                    onChange={(event) =>
                      setInterviewForm(
                        (current) => ({
                          ...current,
                          type: event.target
                            .value,
                        }),
                      )
                    }
                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-400"
                  >
                    <option value="VIDEO">
                      Video
                    </option>
                    <option value="PHONE">
                      Phone
                    </option>
                    <option value="IN_PERSON">
                      In person
                    </option>
                  </select>
                </label>

                {interviewForm.type ===
                  "VIDEO" && (
                  <label className="sm:col-span-2">
                    <span className="text-sm font-semibold text-slate-700">
                      Meeting link
                    </span>

                    <input
                      value={
                        interviewForm.meetingLink
                      }
                      onChange={(event) =>
                        setInterviewForm(
                          (current) => ({
                            ...current,
                            meetingLink:
                              event.target
                                .value,
                          }),
                        )
                      }
                      placeholder="https://meet.google.com/..."
                      className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-400"
                    />
                  </label>
                )}

                {interviewForm.type ===
                  "IN_PERSON" && (
                  <label className="sm:col-span-2">
                    <span className="text-sm font-semibold text-slate-700">
                      Location
                    </span>

                    <input
                      value={
                        interviewForm.location
                      }
                      onChange={(event) =>
                        setInterviewForm(
                          (current) => ({
                            ...current,
                            location:
                              event.target
                                .value,
                          }),
                        )
                      }
                      placeholder="Office address"
                      className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-400"
                    />
                  </label>
                )}

                <label className="sm:col-span-2">
                  <span className="text-sm font-semibold text-slate-700">
                    Notes
                  </span>

                  <textarea
                    rows={4}
                    value={interviewForm.notes}
                    onChange={(event) =>
                      setInterviewForm(
                        (current) => ({
                          ...current,
                          notes: event.target
                            .value,
                        }),
                      )
                    }
                    placeholder="Interview instructions or notes..."
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-400"
                  />
                </label>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={() =>
                    setInterviewApplicant(null)
                  }
                  className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-600"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={interviewSaving}
                  className="h-11 rounded-xl bg-[#0066b3] px-5 text-sm font-bold text-white disabled:opacity-50"
                >
                  {interviewSaving
                    ? "Scheduling..."
                    : "Schedule Interview"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}