import api from "./api";

// ============================================
// GET MY INTERVIEWS
// ============================================

export const getMyInterviews = async (params = {}) => {
  const response = await api.get("/interviews/my", {
    params,
  });

  return response.data;
};

// ============================================
// GET RECRUITER INTERVIEWS
// ============================================

export const getRecruiterInterviews = async (params = {}) => {
  const response = await api.get("/interviews/recruiter", {
    params,
  });

  return response.data;
};

// ============================================
// CREATE INTERVIEW
// ============================================

export const createInterview = async (data) => {
  const response = await api.post("/interviews", data);

  return response.data;
};

// ============================================
// UPDATE INTERVIEW
// ============================================

export const updateInterview = async (id, data) => {
  const response = await api.patch(
    `/interviews/${id}`,
    data
  );

  return response.data;
};

// ============================================
// CANCEL INTERVIEW
// ============================================

export const cancelInterview = async (id, reason = "") => {
  const response = await api.delete(
    `/interviews/${id}`,
    {
      data: {
        reason,
      },
    }
  );

  return response.data;
};