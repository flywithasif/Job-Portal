import { Navigate, Route, Routes, useParams } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import DashboardLayout from "./components/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CompanyDetails from "./pages/CompanyDetails";
import Companies from "./pages/public/Companies";
import CareerAdvice from "./pages/public/CareerAdvice";

import SeekerDashboard from "./pages/seeker/SeekerDashboard";
import Profile from "./pages/seeker/Profile";
import SavedJobs from "./pages/seeker/SavedJobs";
import AppliedJobs from "./pages/seeker/AppliedJobs";
import ApplicationDetails from "./pages/seeker/ApplicationDetails";
import Notifications from "./pages/seeker/Notifications";
import Interviews from "./pages/seeker/Interviews";

import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import ManageJobs from "./pages/recruiter/ManageJobs";
import Applicants from "./pages/recruiter/Applicants";
import CompanyProfile from "./pages/recruiter/CompanyProfile";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/Users";
import AdminCompanies from "./pages/admin/Companies";
import AdminJobs from "./pages/admin/Jobs";
import AdminApplications from "./pages/admin/Applications";
import Moderation from "./pages/admin/Moderation";
import AdminManagement from "./pages/admin/AdminManagement";
import AdminSettings from "./pages/admin/Settings";

import {
  Bookmark,
  BriefcaseBusiness,
  CalendarDays,
  FileText,
  Search,
} from "lucide-react";

const seekerNavItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: BriefcaseBusiness,
  },
  {
    label: "Find Jobs",
    path: "/dashboard/jobs",
    icon: Search,
  },
  {
    label: "Applications",
    path: "/dashboard/applied-jobs",
    icon: FileText,
  },
  {
    label: "Saved Jobs",
    path: "/dashboard/saved-jobs",
    icon: Bookmark,
  },
  {
    label: "Interviews",
    path: "/dashboard/interviews",
    icon: CalendarDays,
  },
];

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

function SeekerLayout({ title, children }) {
  return (
    <ProtectedRoute roles={["JOB_SEEKER"]}>
      <DashboardLayout title={title} navItems={seekerNavItems}>
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function RecruiterLayout({ title, children }) {
  const recruiterNavItems = [
    {
      label: "Dashboard",
      path: "/recruiter",
      icon: BriefcaseBusiness,
    },
    {
      label: "Manage Jobs",
      path: "/recruiter/jobs",
      icon: FileText,
    },
    {
      label: "Applicants",
      path: "/recruiter/applicants",
      icon: Search,
    },
    {
      label: "Company Profile",
      path: "/recruiter/company-profile",
      icon: BriefcaseBusiness,
    },
  ];

  return (
    <ProtectedRoute roles={["RECRUITER"]}>
      <DashboardLayout title={title} navItems={recruiterNavItems}>
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function LegacyApplicationRedirect() {
  const { id } = useParams();

  return <Navigate to={`/dashboard/applications/${id}`} replace />;
}

function AdminRoute({ children }) {
  return (
    <ProtectedRoute roles={["ADMIN", "SUPER_ADMIN"]}>
      {children}
    </ProtectedRoute>
  );
}

function SuperAdminRoute({ children }) {
  return (
    <ProtectedRoute roles={["SUPER_ADMIN"]}>
      {children}
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <Routes>
      {/* ==================== PUBLIC ==================== */}

      <Route
        path="/"
        element={
          <PublicLayout>
            <Home />
          </PublicLayout>
        }
      />

      <Route
        path="/jobs"
        element={
          <PublicLayout>
            <Jobs />
          </PublicLayout>
        }
      />

      <Route
        path="/jobs/:id"
        element={
          <PublicLayout>
            <JobDetails />
          </PublicLayout>
        }
      />

      <Route
        path="/companies"
        element={
          <PublicLayout>
            <Companies />
          </PublicLayout>
        }
      />

      <Route
        path="/companies/:id"
        element={
          <PublicLayout>
            <CompanyDetails />
          </PublicLayout>
        }
      />

      <Route
        path="/career-advice"
        element={
          <PublicLayout>
            <CareerAdvice />
          </PublicLayout>
        }
      />

      <Route
        path="/login"
        element={
          <PublicLayout>
            <Login />
          </PublicLayout>
        }
      />

      <Route
        path="/register"
        element={
          <PublicLayout>
            <Register />
          </PublicLayout>
        }
      />

      {/* ==================== JOB SEEKER ==================== */}

      <Route
        path="/dashboard"
        element={
          <SeekerLayout title="Job Seeker Dashboard">
            <SeekerDashboard />
          </SeekerLayout>
        }
      />

      <Route
        path="/dashboard/jobs"
        element={
          <SeekerLayout title="Find Jobs">
            <Jobs />
          </SeekerLayout>
        }
      />

      <Route
        path="/dashboard/jobs/:id"
        element={
          <SeekerLayout title="Job Details">
            <JobDetails />
          </SeekerLayout>
        }
      />

      <Route
        path="/dashboard/profile"
        element={
          <SeekerLayout title="My Profile">
            <Profile />
          </SeekerLayout>
        }
      />

      <Route
        path="/dashboard/saved-jobs"
        element={
          <SeekerLayout title="Saved Jobs">
            <SavedJobs />
          </SeekerLayout>
        }
      />

      <Route
        path="/dashboard/applied-jobs"
        element={
          <SeekerLayout title="My Applications">
            <AppliedJobs />
          </SeekerLayout>
        }
      />

      <Route
        path="/dashboard/applications/:id"
        element={
          <SeekerLayout title="Application Details">
            <ApplicationDetails />
          </SeekerLayout>
        }
      />

      <Route
        path="/dashboard/notifications"
        element={
          <SeekerLayout title="Notifications">
            <Notifications />
          </SeekerLayout>
        }
      />

      <Route
        path="/dashboard/interviews"
        element={
          <SeekerLayout title="Interviews">
            <Interviews />
          </SeekerLayout>
        }
      />

      {/* ==================== LEGACY SEEKER URLS ==================== */}

      <Route
        path="/profile"
        element={<Navigate to="/dashboard/profile" replace />}
      />

      <Route
        path="/saved-jobs"
        element={<Navigate to="/dashboard/saved-jobs" replace />}
      />

      <Route
        path="/applied-jobs"
        element={<Navigate to="/dashboard/applied-jobs" replace />}
      />

      <Route
        path="/applications/:id"
        element={<LegacyApplicationRedirect />}
      />

      <Route
        path="/notifications"
        element={<Navigate to="/dashboard/notifications" replace />}
      />

      <Route
        path="/interviews"
        element={<Navigate to="/dashboard/interviews" replace />}
      />

      {/* ==================== RECRUITER ==================== */}

      <Route
        path="/recruiter"
        element={
          <RecruiterLayout title="Recruiter Dashboard">
            <RecruiterDashboard />
          </RecruiterLayout>
        }
      />

      <Route
        path="/recruiter/jobs"
        element={
          <RecruiterLayout title="Manage Jobs">
            <ManageJobs />
          </RecruiterLayout>
        }
      />

      <Route
        path="/recruiter/applicants"
        element={
          <RecruiterLayout title="Applicants">
            <Applicants />
          </RecruiterLayout>
        }
      />

      <Route
        path="/recruiter/company-profile"
        element={
          <RecruiterLayout title="Company Profile">
            <CompanyProfile />
          </RecruiterLayout>
        }
      />

      {/* ==================== ADMIN ==================== */}

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <AdminUsers />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/companies"
        element={
          <AdminRoute>
            <AdminCompanies />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/jobs"
        element={
          <AdminRoute>
            <AdminJobs />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/applications"
        element={
          <AdminRoute>
            <AdminApplications />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/moderation"
        element={
          <AdminRoute>
            <Moderation />
          </AdminRoute>
        }
      />

      {/* SUPER ADMIN ONLY */}

      <Route
        path="/admin/admins"
        element={
          <SuperAdminRoute>
            <AdminManagement />
          </SuperAdminRoute>
        }
      />

      <Route
        path="/admin/settings"
        element={
          <AdminRoute>
            <AdminSettings />
          </AdminRoute>
        }
      />

      {/* ==================== 404 ==================== */}

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}