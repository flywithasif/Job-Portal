import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getCurrentUser,
  loginUser,
  registerUser,
} from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // RESTORE AUTHENTICATION
  // ==========================================

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem(
        "job_portal_token"
      );

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await getCurrentUser();

        setUser(response.data.user);

        localStorage.setItem(
          "job_portal_user",
          JSON.stringify(response.data.user)
        );
      } catch (error) {
        console.error(
          "Session restore failed:",
          error
        );

        localStorage.removeItem(
          "job_portal_token"
        );

        localStorage.removeItem(
          "job_portal_user"
        );

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  // ==========================================
  // LOGIN
  // ==========================================

  const login = async (credentials) => {
    const response = await loginUser(credentials);

    const loggedInUser =
      response.data.user;

    const token = response.data.token;

    localStorage.setItem(
      "job_portal_token",
      token
    );

    localStorage.setItem(
      "job_portal_user",
      JSON.stringify(loggedInUser)
    );

    setUser(loggedInUser);

    return response;
  };

  // ==========================================
  // REGISTER
  // ==========================================

  const register = async (userData) => {
    const response =
      await registerUser(userData);

    const registeredUser =
      response.data.user;

    const token = response.data.token;

    localStorage.setItem(
      "job_portal_token",
      token
    );

    localStorage.setItem(
      "job_portal_user",
      JSON.stringify(registeredUser)
    );

    setUser(registeredUser);

    return response;
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = () => {
    localStorage.removeItem(
      "job_portal_token"
    );

    localStorage.removeItem(
      "job_portal_user"
    );

    setUser(null);
  };

  // ==========================================
  // CONTEXT VALUE
  // ==========================================

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ============================================
// CUSTOM HOOK
// ============================================

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider."
    );
  }

  return context;
};