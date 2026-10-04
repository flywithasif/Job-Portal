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

  // Fix: Support the SUPER_ADMIN value sent by Login.jsx.
  SUPER_ADMIN: {
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
    if (!email?.trim() || !password) {
      throw new Error("Email and password are required.");
    }

    const selectedRole = String(role || "JOB_SEEKER")
      .trim()
      .toUpperCase();

    const baseUser = DEMO_USERS[selectedRole];

    if (!baseUser) {
      throw new Error("Invalid account type selected.");
    }

    const loggedInUser = {
      ...baseUser,
      email: email.trim(),
    };

    setUser(loggedInUser);

    return loggedInUser;
  };

  const register = async ({ name, email, role }) => {
    const selectedRole = String(role || "JOB_SEEKER")
      .trim()
      .toUpperCase();

    if (!["JOB_SEEKER", "RECRUITER"].includes(selectedRole)) {
      throw new Error("Invalid registration account type.");
    }

    const registeredUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      role: selectedRole,
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
