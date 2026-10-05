import api from "./api";

/*
 * Get public jobs.
 *
 * Supported query parameters:
 * - page
 * - limit
 * - search
 * - location
 * - workplaceType
 * - employmentType
 * - experienceLevel
 * - company
 * - salaryMin
 */
export const getJobs = async (params = {}) => {
  const response = await api.get("/jobs", {
    params,
  });

  return response.data;
};

/*
 * Get a single public job by ID.
 */
export const getJobById = async (jobId) => {
  const response = await api.get(`/jobs/${jobId}`);

  return response.data;
};

/*
 * Recruiter/Admin:
 * Get jobs created by the logged-in user.
 */
export const getMyJobs = async (params = {}) => {
  const response = await api.get("/jobs/my", {
    params,
  });

  return response.data;
};

/*
 * Recruiter/Admin:
 * Create a new job.
 */
export const createJob = async (jobData) => {
  const response = await api.post("/jobs", jobData);

  return response.data;
};

/*
 * Recruiter/Admin:
 * Update an existing job.
 */
export const updateJob = async (jobId, jobData) => {
  const response = await api.put(`/jobs/${jobId}`, jobData);

  return response.data;
};

/*
 * Recruiter/Admin:
 * Delete an existing job.
 */
export const deleteJob = async (jobId) => {
  const response = await api.delete(`/jobs/${jobId}`);

  return response.data;
};