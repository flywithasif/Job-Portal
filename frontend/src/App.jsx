import { Navigate, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";

import SeekerDashboard from "./pages/seeker/SeekerDashboard";
import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

function DashboardLayoutWrapper({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

function PlaceholderPage({ title }) {
  return (
    <main className="mx-auto min-h-[60vh] max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
      <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#0066b3]">
        CareerFlow
      </p>

      <h1 className="mt-3 text-3xl font-black text-[#172b4d]">
        {title}
      </h1>

      <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">
        This section is part of the platform and will be connected to
        the backend modules in the next development phase.
      </p>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
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
            <PlaceholderPage title="Explore Companies" />
          </PublicLayout>
        }
      />

      <Route
        path="/career-advice"
        element={
          <PublicLayout>
            <PlaceholderPage title="Career Advice" />
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

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute roles={["JOB_SEEKER"]}>
            <DashboardLayoutWrapper>
              <SeekerDashboard />
            </DashboardLayoutWrapper>
          </ProtectedRoute>
        }
      />

      <Route
        path="/recruiter"
        element={
          <ProtectedRoute roles={["RECRUITER"]}>
            <DashboardLayoutWrapper>
              <RecruiterDashboard />
            </DashboardLayoutWrapper>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["SUPER_ADMIN", "ADMIN"]}>
            <DashboardLayoutWrapper>
              <AdminDashboard />
            </DashboardLayoutWrapper>
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}
