import { Navigate, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Public pages
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CompanyDetails from "./pages/CompanyDetails";

// Password recovery pages
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOTP from "./pages/VerifyOTP";
import ResetPassword from "./pages/ResetPassword";

// Job seeker pages
import SeekerDashboard from "./pages/seeker/SeekerDashboard";
import Profile from "./pages/seeker/Profile";
import SavedJobs from "./pages/seeker/SavedJobs";
import AppliedJobs from "./pages/seeker/AppliedJobs";
import ApplicationDetails from "./pages/seeker/ApplicationDetails";
import Notifications from "./pages/seeker/Notifications";
import Interviews from "./pages/seeker/Interviews";

// Recruiter pages
import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import ManageJobs from "./pages/recruiter/ManageJobs";
import Applicants from "./pages/recruiter/Applicants";
import CompanyProfile from "./pages/recruiter/CompanyProfile";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import Users from "./pages/admin/Users";
import Companies from "./pages/admin/Companies";
import AdminJobs from "./pages/admin/Jobs";
import Moderation from "./pages/admin/Moderation";

// Public pages use the main navbar and footer.
function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

// Dashboard pages use the navbar without the public footer.
function DashboardLayoutWrapper({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

// Reusable role-protected route.
function ProtectedPage({ roles, children }) {
  return (
    <ProtectedRoute roles={roles}>
      <DashboardLayoutWrapper>{children}</DashboardLayoutWrapper>
    </ProtectedRoute>
  );
}

// Reusable public placeholder page.
function PlaceholderPage({ title, description }) {
  return (
    <PublicLayout>
      <main className="mx-auto min-h-[60vh] max-w-7xl px-4 py-20 text-center">
        <h1 className="text-3xl font-black text-[#172b4d]">
          {title}
        </h1>

        <p className="mt-3 text-slate-500">
          {description}
        </p>
      </main>
    </PublicLayout>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Public pages */}
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

      {/* Companies */}
      <Route
        path="/companies"
        element={
          <PlaceholderPage
            title="Explore Companies"
            description="Company listings will be available here."
          />
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

      {/* Career advice */}
      <Route
        path="/career-advice"
        element={
          <PlaceholderPage
            title="Career Advice"
            description="Career resources will be available here."
          />
        }
      />

      {/* Authentication */}
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

      {/* Password recovery */}
      <Route
        path="/forgot-password"
        element={
          <PublicLayout>
            <ForgotPassword />
          </PublicLayout>
        }
      />

      <Route
        path="/verify-otp"
        element={
          <PublicLayout>
            <VerifyOTP />
          </PublicLayout>
        }
      />

      <Route
        path="/reset-password"
        element={
          <PublicLayout>
            <ResetPassword />
          </PublicLayout>
        }
      />

      {/* Job seeker routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedPage roles={["JOB_SEEKER"]}>
            <SeekerDashboard />
          </ProtectedPage>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedPage roles={["JOB_SEEKER"]}>
            <Profile />
          </ProtectedPage>
        }
      />

      <Route
        path="/saved-jobs"
        element={
          <ProtectedPage roles={["JOB_SEEKER"]}>
            <SavedJobs />
          </ProtectedPage>
        }
      />

      <Route
        path="/applied-jobs"
        element={
          <ProtectedPage roles={["JOB_SEEKER"]}>
            <AppliedJobs />
          </ProtectedPage>
        }
      />

      <Route
        path="/applications/:id"
        element={
          <ProtectedPage roles={["JOB_SEEKER"]}>
            <ApplicationDetails />
          </ProtectedPage>
        }
      />

      <Route
        path="/notifications"
        element={
          <ProtectedPage roles={["JOB_SEEKER"]}>
            <Notifications />
          </ProtectedPage>
        }
      />

      <Route
        path="/interviews"
        element={
          <ProtectedPage roles={["JOB_SEEKER"]}>
            <Interviews />
          </ProtectedPage>
        }
      />

      {/* Compatibility routes for existing dashboard links */}
      <Route
        path="/dashboard/saved"
        element={<Navigate to="/saved-jobs" replace />}
      />

      <Route
        path="/dashboard/applications"
        element={<Navigate to="/applied-jobs" replace />}
      />

      <Route
        path="/dashboard/interviews"
        element={<Navigate to="/interviews" replace />}
      />

      {/* Recruiter routes */}
      <Route
        path="/recruiter"
        element={
          <ProtectedPage roles={["RECRUITER"]}>
            <RecruiterDashboard />
          </ProtectedPage>
        }
      />

      <Route
        path="/recruiter/jobs"
        element={
          <ProtectedPage roles={["RECRUITER"]}>
            <ManageJobs />
          </ProtectedPage>
        }
      />

      <Route
        path="/recruiter/applicants"
        element={
          <ProtectedPage roles={["RECRUITER"]}>
            <Applicants />
          </ProtectedPage>
        }
      />

      <Route
        path="/recruiter/company-profile"
        element={
          <ProtectedPage roles={["RECRUITER"]}>
            <CompanyProfile />
          </ProtectedPage>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <ProtectedPage roles={["SUPER_ADMIN", "ADMIN"]}>
            <AdminDashboard />
          </ProtectedPage>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedPage roles={["SUPER_ADMIN", "ADMIN"]}>
            <Users />
          </ProtectedPage>
        }
      />

      <Route
        path="/admin/companies"
        element={
          <ProtectedPage roles={["SUPER_ADMIN", "ADMIN"]}>
            <Companies />
          </ProtectedPage>
        }
      />

      <Route
        path="/admin/jobs"
        element={
          <ProtectedPage roles={["SUPER_ADMIN", "ADMIN"]}>
            <AdminJobs />
          </ProtectedPage>
        }
      />

      <Route
        path="/admin/moderation"
        element={
          <ProtectedPage roles={["SUPER_ADMIN", "ADMIN"]}>
            <Moderation />
          </ProtectedPage>
        }
      />

      {/* Unknown URLs */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}
