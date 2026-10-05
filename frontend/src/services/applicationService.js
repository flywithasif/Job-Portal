import api from "./api";

// Apply for a job
export const createApplication = async (applicationData) => {
  const response = await api.post("/applications", applicationData);

  return response.data;
};

// Get logged-in job seeker's applications
export const getMyApplications = async () => {
  const response = await api.get("/applications/my");

  return response.data;
};

// Get applications for recruiter's jobs
export const getJobApplications = async (params = {}) => {
  const response = await api.get("/applications/jobs", {
    params,
  });

  return response.data;
};

// Update application status
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