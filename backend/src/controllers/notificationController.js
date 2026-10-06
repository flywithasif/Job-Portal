const mongoose = require("mongoose");

const Notification = require("../models/Notification");

// ============================================
// GET MY NOTIFICATIONS
// GET /api/notifications
// ============================================

const getMyNotifications = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);

    const limit = Math.min(
      50,
      Math.max(1, parseInt(req.query.limit, 10) || 20),
    );

    const skip = (page - 1) * limit;

    const filter = {
      recipient: req.user._id,
    };

    // Optional read filter
    if (req.query.read === "true") {
      filter.read = true;
    }

    if (req.query.read === "false") {
      filter.read = false;
    }

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(filter)
        .populate(
          "relatedApplication",
          "_id status createdAt",
        )
        .populate(
          "relatedJob",
          "_id title companyName location",
        )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Notification.countDocuments(filter),

      Notification.countDocuments({
        recipient: req.user._id,
        read: false,
      }),
    ]);

    return res.status(200).json({
      success: true,

      data: notifications,

      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },

      unreadCount,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// GET UNREAD NOTIFICATION COUNT
// GET /api/notifications/unread-count
// ============================================

const getUnreadCount = async (req, res, next) => {
  try {
    const unreadCount = await Notification.countDocuments({
      recipient: req.user._id,
      read: false,
    });

    return res.status(200).json({
      success: true,
      unreadCount,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// MARK ONE NOTIFICATION AS READ
// PATCH /api/notifications/:id/read
// ============================================

const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID.",
      });
    }

    const notification = await Notification.findOneAndUpdate(
      {
        _id: id,
        recipient: req.user._id,
      },
      {
        $set: {
          read: true,
          readAt: new Date(),
        },
      },
      {
        new: true,
      },
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification marked as read.",
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// MARK ALL NOTIFICATIONS AS READ
// PATCH /api/notifications/read-all
// ============================================

const markAllAsRead = async (req, res, next) => {
  try {
    const result = await Notification.updateMany(
      {
        recipient: req.user._id,
        read: false,
      },
      {
        $set: {
          read: true,
          readAt: new Date(),
        },
      },
    );

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read.",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// DELETE ONE NOTIFICATION
// DELETE /api/notifications/:id
// ============================================

const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID.",
      });
    }

    const notification =
      await Notification.findOneAndDelete({
        _id: id,
        recipient: req.user._id,
      });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// DELETE ALL READ NOTIFICATIONS
// DELETE /api/notifications/read
// ============================================

const deleteReadNotifications = async (req, res, next) => {
  try {
    const result = await Notification.deleteMany({
      recipient: req.user._id,
      read: true,
    });

    return res.status(200).json({
      success: true,
      message: "Read notifications cleared successfully.",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteReadNotifications,
};