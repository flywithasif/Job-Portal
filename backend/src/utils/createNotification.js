const Notification = require("../models/Notification");

const createNotification = async ({
  recipient,
  type = "SYSTEM",
  title,
  message,
  link = "",
  relatedApplication = null,
  relatedJob = null,
}) => {
  if (!recipient || !title || !message) {
    return null;
  }

  return Notification.create({
    recipient,
    type,
    title,
    message,
    link,
    relatedApplication,
    relatedJob,
  });
};

module.exports = createNotification;