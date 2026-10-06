import api from "./api";

// ============================================
// REGISTER USER
// ============================================

export const registerUser = async (userData) => {
  const response = await api.post(
    "/auth/register",
    userData,
  );

  return response.data;
};

// ============================================
// LOGIN USER
// ============================================

export const loginUser = async (credentials) => {
  const response = await api.post(
    "/auth/login",
    credentials,
  );

  return response.data;
};

// ============================================
// GET CURRENT LOGGED-IN USER
// ============================================

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");

  return response.data;
};