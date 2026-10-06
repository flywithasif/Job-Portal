import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
  children,
  roles,
  allowedRoles = [],
}) {
  const {
    user,
    loading = false,
    isAuthenticated,
  } = useAuth();

  const location = useLocation();

  // ==========================================
  // REQUIRED ROLES
  // ==========================================

  const requiredRoles =
    allowedRoles.length > 0
      ? allowedRoles
      : roles || [];

  // ==========================================
  // AUTHENTICATION RESTORATION
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#0066b3]" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading your account...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // NOT AUTHENTICATED
  // ==========================================

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

  // ==========================================
  // ROLE AUTHORIZATION
  // ==========================================

  if (
    requiredRoles.length > 0 &&
    !requiredRoles.includes(user.role)
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

  // ==========================================
  // IMPORTANT
  // ==========================================
  //
  // App.jsx uses ProtectedRoute as a wrapper:
  //
  // <ProtectedRoute>
  //   <DashboardLayout>
  //     <Page />
  //   </DashboardLayout>
  // </ProtectedRoute>
  //
  // Therefore we MUST render children.
  //

  return children;
}