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



import SeekerDashboard from "./pages/seeker/SeekerDashboard";

import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";

import AdminDashboard from "./pages/admin/AdminDashboard";

import Profile from "./pages/seeker/Profile";

import SavedJobs from "./pages/seeker/SavedJobs";

import AppliedJobs from "./pages/seeker/AppliedJobs";

import ApplicationDetails from "./pages/seeker/ApplicationDetails";

import Notifications from "./pages/seeker/Notifications";

import Interviews from "./pages/seeker/Interviews";



import ManageJobs from "./pages/recruiter/ManageJobs";

import Applicants from "./pages/recruiter/Applicants";

import CompanyProfile from "./pages/recruiter/CompanyProfile";



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

      <DashboardLayout

        title={title}

        navItems={seekerNavItems}

      >

        {children}

      </DashboardLayout>

    </ProtectedRoute>

  );

}



function LegacyApplicationRedirect() {

  const { id } = useParams();



  return <Navigate to={`/dashboard/applications/${id}`} replace />;

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



      {/* =========================================================

          JOB SEEKER DASHBOARD

      ========================================================== */}



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



      {/* Old seeker URLs -> new dashboard URLs */}

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



      {/* Recruiter */}

      <Route

        path="/recruiter"

        element={

          <ProtectedRoute allowedRoles={["RECRUITER"]}>

            <DashboardLayout

              title="Recruiter Dashboard"

              navItems={[

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

              ]}

            >

              <RecruiterDashboard />

            </DashboardLayout>

          </ProtectedRoute>

        }

      />



      <Route

        path="/recruiter/jobs"

        element={

          <ProtectedRoute allowedRoles={["RECRUITER"]}>

            <DashboardLayout

              title="Manage Jobs"

              navItems={[

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

              ]}

            >

              <ManageJobs />

            </DashboardLayout>

          </ProtectedRoute>

        }

      />



      <Route

        path="/recruiter/applicants"

        element={

          <ProtectedRoute allowedRoles={["RECRUITER"]}>

            <DashboardLayout

              title="Applicants"

              navItems={[

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

              ]}

            >

              <Applicants />

            </DashboardLayout>

          </ProtectedRoute>

        }

      />



      <Route

        path="/recruiter/company-profile"

        element={

          <ProtectedRoute allowedRoles={["RECRUITER"]}>

            <DashboardLayout

              title="Company Profile"

              navItems={[

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

              ]}

            >

              <CompanyProfile />

            </DashboardLayout>

          </ProtectedRoute>

        }

      />



      {/* Admin */}

      <Route

        path="/admin"

        element={

          <ProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN"]}>

            <DashboardLayout

              title="Admin Dashboard"

              navItems={[

                {

                  label: "Dashboard",

                  path: "/admin",

                  icon: BriefcaseBusiness,

                },

              ]}

            >

              <AdminDashboard />

            </DashboardLayout>

          </ProtectedRoute>

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

        path="*"

        element={<Navigate to="/" replace />}

      />

    </Routes>

  );

}
