import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, roles }) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // Redirect unauthenticated users to login.
  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // Restrict access according to the user's role.
  if (roles && !roles.includes(user.role)) {
    const homeByRole = {
      JOB_SEEKER: "/dashboard",
      RECRUITER: "/recruiter",
      ADMIN: "/admin",
      SUPER_ADMIN: "/admin",
    };

    return (
      <Navigate
        to={homeByRole[user.role] || "/"}
        replace
      />
    );
  }

  return children;
}
