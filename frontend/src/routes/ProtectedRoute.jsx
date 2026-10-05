import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
  allowedRoles = [],
}) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // User is not authenticated.
  // Send them to login and remember the page
  // they originally wanted to visit.
  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  // If specific roles are required, verify
  // the authenticated user's role.
  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user.role)
  ) {
    if (user.role === "RECRUITER") {
      return (
        <Navigate
          to="/recruiter"
          replace
        />
      );
    }

    if (
      user.role === "ADMIN" ||
      user.role === "SUPER_ADMIN"
    ) {
      return (
        <Navigate
          to="/admin"
          replace
        />
      );
    }

    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  // IMPORTANT:
  // App.jsx uses ProtectedRoute as a parent route,
  // so nested routes must be rendered through Outlet.
  return <Outlet />;
}