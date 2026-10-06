const express = require("express");

const {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteReadNotifications,
} = require("../controllers/notificationController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// All notification routes require authentication.
router.use(protect);

// Get notifications
router.get("/", getMyNotifications);

// Get unread count
router.get("/unread-count", getUnreadCount);

// Mark all as read
router.patch("/read-all", markAllAsRead);

// Delete all read notifications
router.delete("/read", deleteReadNotifications);

// Mark one notification as read
router.patch("/:id/read", markAsRead);

// Delete one notification
router.delete("/:id", deleteNotification);

module.exports = router;