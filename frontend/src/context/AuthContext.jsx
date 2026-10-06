import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getCurrentUser,
  loginUser,
  registerUser,
} from "../services/authService";

const AuthContext = createContext(null);

const TOKEN_KEY = "job_portal_token";
const USER_KEY = "job_portal_user";

// ============================================
// RESPONSE HELPERS
// ============================================

const extractUser = (response) => {
  return (
    response?.data?.data?.user ||
    response?.data?.user ||
    response?.user ||
    null
  );
};

const extractToken = (response) => {
  return (
    response?.data?.data?.token ||
    response?.data?.token ||
    response?.token ||
    null
  );
};

// ============================================
// AUTH PROVIDER
// ============================================

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // RESTORE AUTHENTICATION
  // ==========================================

  useEffect(() => {
    let mounted = true;

    const restoreSession = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      const savedUser = localStorage.getItem(USER_KEY);

      // ----------------------------------------
      // NO TOKEN = NOT LOGGED IN
      // ----------------------------------------

      if (!token) {
        if (mounted) {
          setUser(null);
          setLoading(false);
        }

        return;
      }

      // ----------------------------------------
      // RESTORE SAVED USER IMMEDIATELY
      // ----------------------------------------

      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);

          if (mounted && parsedUser) {
            setUser(parsedUser);
          }
        } catch (error) {
          console.error(
            "Saved user data is invalid:",
            error,
          );

          localStorage.removeItem(USER_KEY);
        }
      }

      // ----------------------------------------
      // VERIFY SESSION WITH BACKEND
      // ----------------------------------------

      try {
        const response = await getCurrentUser();

        const currentUser = extractUser(response);

        if (!mounted) {
          return;
        }

        if (!currentUser) {
          throw new Error(
            "Unable to restore authenticated user.",
          );
        }

        setUser(currentUser);

        localStorage.setItem(
          USER_KEY,
          JSON.stringify(currentUser),
        );
      } catch (error) {
        console.error(
          "Session restore failed:",
          error,
        );

        if (!mounted) {
          return;
        }

        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);

        setUser(null);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    restoreSession();

    return () => {
      mounted = false;
    };
  }, []);

  // ==========================================
  // LOGIN
  // ==========================================

  const login = async (credentials) => {
    const response = await loginUser(credentials);

    const loggedInUser = extractUser(response);
    const token = extractToken(response);

    if (!loggedInUser) {
      throw new Error(
        "Login response is missing user.",
      );
    }

    if (!token) {
      throw new Error(
        "Login response is missing token.",
      );
    }

    // ----------------------------------------
    // SAVE AUTH DATA
    // ----------------------------------------

    localStorage.setItem(
      TOKEN_KEY,
      token,
    );

    localStorage.setItem(
      USER_KEY,
      JSON.stringify(loggedInUser),
    );

    setUser(loggedInUser);

    // ----------------------------------------
    // IMPORTANT:
    // Return USER, not complete response.
    // Login.jsx can directly use user.role.
    // ----------------------------------------

    return loggedInUser;
  };

  // ==========================================
  // REGISTER
  // ==========================================

  const register = async (userData) => {
    const response = await registerUser(userData);

    const registeredUser = extractUser(response);
    const token = extractToken(response);

    if (!registeredUser) {
      throw new Error(
        "Registration response is missing user.",
      );
    }

    if (!token) {
      throw new Error(
        "Registration response is missing token.",
      );
    }

    // ----------------------------------------
    // SAVE AUTH DATA
    // ----------------------------------------

    localStorage.setItem(
      TOKEN_KEY,
      token,
    );

    localStorage.setItem(
      USER_KEY,
      JSON.stringify(registeredUser),
    );

    setUser(registeredUser);

    return registeredUser;
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    setUser(null);
  };

  // ==========================================
  // CONTEXT VALUE
  // ==========================================

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
    }),
    [user, loading],
  );

  // ==========================================
  // PROVIDER
  // ==========================================

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
      "useAuth must be used inside AuthProvider.",
    );
  }

  return context;
};