import api from "./api";

// ============================================
// ADMIN DASHBOARD
// ============================================

export const getAdminDashboard = async () => {
  const response = await api.get("/admin/dashboard");

  return response.data;
};

// ============================================
// USERS
// ============================================

export const getAdminUsers = async (params = {}) => {
  const response = await api.get("/admin/users", {
    params,
  });

  return response.data;
};

// ============================================
// UPDATE USER STATUS
// ============================================

export const updateAdminUserStatus = async (
  userId,
  isActive,
) => {
  const response = await api.patch(
    `/admin/users/${userId}/status`,
    {
      isActive,
    },
  );

  return response.data;
};

// ============================================
// UPDATE USER ROLE
// ============================================

export const updateAdminUserRole = async (
  userId,
  role,
) => {
  const response = await api.patch(
    `/admin/users/${userId}/role`,
    {
      role,
    },
  );

  return response.data;
};

// ============================================
// JOBS
// ============================================

export const getAdminJobs = async (params = {}) => {
  const response = await api.get("/admin/jobs", {
    params,
  });

  return response.data;
};

// ============================================
// UPDATE JOB STATUS
// ============================================

export const updateAdminJobStatus = async (
  jobId,
  status,
) => {
  const response = await api.patch(
    `/admin/jobs/${jobId}/status`,
    {
      status,
    },
  );

  return response.data;
};

// ============================================
// APPLICATIONS
// ============================================

export const getAdminApplications = async (
  params = {},
) => {
  const response = await api.get(
    "/admin/applications",
    {
      params,
    },
  );

  return response.data;
};