import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

const DEMO_USERS = {
  JOB_SEEKER: {
    id: "user-001",
    name: "Asif Khan",
    email: "asif@example.com",
    role: "JOB_SEEKER",
  },

  RECRUITER: {
    id: "recruiter-001",
    name: "Rahul Sharma",
    email: "recruiter@example.com",
    role: "RECRUITER",
  },

  ADMIN: {
    id: "admin-001",
    name: "Super Admin",
    email: "admin@example.com",
    role: "SUPER_ADMIN",
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("job_portal_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("job_portal_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("job_portal_user");
    }
  }, [user]);

  const login = async ({ email, password, role }) => {
    if (!email || !password) {
      throw new Error("Email and password are required.");
    }

    const selectedRole = role || "JOB_SEEKER";

    const baseUser =
      DEMO_USERS[selectedRole] || DEMO_USERS.JOB_SEEKER;

    const loggedInUser = {
      ...baseUser,
      email,
    };

    setUser(loggedInUser);

    return loggedInUser;
  };

  const register = async ({ name, email, role }) => {
    const registeredUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      role: role || "JOB_SEEKER",
    };

    setUser(registeredUser);

    return registeredUser;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
