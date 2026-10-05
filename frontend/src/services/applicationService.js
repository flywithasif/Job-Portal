import api from "./api";

export const applyForJob = async (applicationData) => {
  const response = await api.post("/applications", applicationData);

  return response.data;
};

export const getMyApplications = async (params = {}) => {
  const response = await api.get("/applications/my", {
    params,
  });

  return response.data;
};

export const getJobApplications = async (params = {}) => {
  const response = await api.get("/applications/recruiter", {
    params,
  });

  return response.data;
};

export const updateApplicationStatus = async (
  applicationId,
  status,
) => {
  const response = await api.patch(
    `/applications/${applicationId}/status`,
    { status },
  );

  return response.data;
};

export const getApplicationById = async (applicationId) => {
  const response = await api.get(`/applications/${applicationId}`);

  return response.data;
};