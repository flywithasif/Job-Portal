import api from "./api";

// ============================================
// GET MY NOTIFICATIONS
// ============================================

export const getMyNotifications = async (params = {}) => {
  const response = await api.get("/notifications", {
    params,
  });

  return response.data;
};

// ============================================
// GET UNREAD NOTIFICATION COUNT
// ============================================

export const getUnreadNotificationCount = async () => {
  const response = await api.get(
    "/notifications/unread-count",
  );

  return response.data;
};

// ============================================
// MARK ONE NOTIFICATION AS READ
// ============================================

export const markNotificationAsRead = async (
  notificationId,
) => {
  const response = await api.patch(
    `/notifications/${notificationId}/read`,
  );

  return response.data;
};

// ============================================
// MARK ALL NOTIFICATIONS AS READ
// ============================================

export const markAllNotificationsAsRead = async () => {
  const response = await api.patch(
    "/notifications/read-all",
  );

  return response.data;
};

// ============================================
// DELETE ONE NOTIFICATION
// ============================================

export const deleteNotification = async (
  notificationId,
) => {
  const response = await api.delete(
    `/notifications/${notificationId}`,
  );

  return response.data;
};

// ============================================
// CLEAR ALL READ NOTIFICATIONS
// ============================================

export const clearReadNotifications = async () => {
  const response = await api.delete(
    "/notifications/read",
  );

  return response.data;
};