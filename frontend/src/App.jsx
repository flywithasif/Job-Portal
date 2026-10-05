import { Navigate, Outlet, Route, Routes } from "react-router-dom";

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

/*
 * Public layout
 *
 * Used for public-facing pages that need
 * the main navbar and footer.
 */
function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

/*
 * Dashboard layout
 *
 * Protected pages use the navbar but do not
 * display the public footer.
 */
function DashboardLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

/*
 * Simple public placeholder page.
 */
function PlaceholderPage({ title, description }) {
  return (
    <PublicLayout>
      <main className="mx-auto min-h-[60vh] max-w-7xl px-4 py-20 text-center">
        <h1 className="text-3xl font-black text-[#172b4d]">
          {title}
        </h1>

        <p className="mt-3 text-slate-500">{description}</p>
      </main>
    </PublicLayout>
  );
}

export default function App() {
  return (
    <Routes>
      {/* =========================================================
          PUBLIC ROUTES
          ========================================================= */}

      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />

        <Route path="/jobs" element={<Jobs />} />

        <Route path="/jobs/:id" element={<JobDetails />} />

        <Route
          path="/companies"
          element={
            <PlaceholderPage
              title="Explore Companies"
              description="Company listings will be available here."
            />
          }
        />

        <Route path="/companies/:id" element={<CompanyDetails />} />

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

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* Password recovery */}

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route path="/verify-otp" element={<VerifyOTP />} />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />
      </Route>

      {/* =========================================================
          JOB SEEKER ROUTES
          ========================================================= */}

      <Route
        element={
          <ProtectedRoute allowedRoles={["JOB_SEEKER"]} />
        }
      >
        <Route element={<DashboardLayout />}>
          <Route
            path="/dashboard"
            element={<SeekerDashboard />}
          />

          <Route path="/profile" element={<Profile />} />

          <Route
            path="/saved-jobs"
            element={<SavedJobs />}
          />

          <Route
            path="/applied-jobs"
            element={<AppliedJobs />}
          />

          <Route
            path="/applications/:id"
            element={<ApplicationDetails />}
          />

          <Route
            path="/notifications"
            element={<Notifications />}
          />

          <Route
            path="/interviews"
            element={<Interviews />}
          />
        </Route>
      </Route>

      {/* =========================================================
          COMPATIBILITY ROUTES
          ========================================================= */}

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

      {/* =========================================================
          RECRUITER ROUTES
          ========================================================= */}

      <Route
        element={
          <ProtectedRoute allowedRoles={["RECRUITER"]} />
        }
      >
        <Route element={<DashboardLayout />}>
          <Route
            path="/recruiter"
            element={<RecruiterDashboard />}
          />

          <Route
            path="/recruiter/jobs"
            element={<ManageJobs />}
          />

          <Route
            path="/recruiter/applicants"
            element={<Applicants />}
          />

          <Route
            path="/recruiter/company-profile"
            element={<CompanyProfile />}
          />
        </Route>
      </Route>

      {/* =========================================================
          ADMIN ROUTES
          ========================================================= */}

      <Route
        element={
          <ProtectedRoute
            allowedRoles={["SUPER_ADMIN", "ADMIN"]}
          />
        }
      >
        <Route element={<DashboardLayout />}>
          <Route
            path="/admin"
            element={<AdminDashboard />}
          />

          <Route
            path="/admin/users"
            element={<Users />}
          />

          <Route
            path="/admin/companies"
            element={<Companies />}
          />

          <Route
            path="/admin/jobs"
            element={<AdminJobs />}
          />

          <Route
            path="/admin/moderation"
            element={<Moderation />}
          />
        </Route>
      </Route>

      {/* =========================================================
          UNKNOWN ROUTES
          ========================================================= */}

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}