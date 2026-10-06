import api from "./api";

// ============================================
// APPLY FOR A JOB
// ============================================

export const createApplication = async (applicationData) => {
  const response = await api.post("/applications", applicationData);

  return response.data;
};

// ============================================
// GET MY APPLICATIONS
// ============================================

export const getMyApplications = async () => {
  const response = await api.get("/applications/my");

  return response.data;
};

// ============================================
// GET APPLICATIONS FOR A SPECIFIC JOB
// Recruiter / Admin
// ============================================

export const getJobApplications = async (jobId, params = {}) => {
  const response = await api.get(`/applications/job/${jobId}`, {
    params,
  });

  return response.data;
};

// ============================================
// UPDATE APPLICATION STATUS
// Recruiter / Admin
// ============================================

export const updateApplicationStatus = async (
  applicationId,
  status,
) => {
  const response = await api.patch(
    `/applications/${applicationId}/status`,
    {
      status,
    },
  );

  return response.data;
};