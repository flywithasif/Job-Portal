import {
  ArrowUpRight,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Eye,
  Plus,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../components/DashboardLayout";

const navItems = [
  {
    label: "Dashboard",
    path: "/recruiter",
    icon: BarChart3,
  },
  {
    label: "My Jobs",
    path: "/recruiter/jobs",
    icon: BriefcaseBusiness,
  },
  {
    label: "Applicants",
    path: "/recruiter/applicants",
    icon: Users,
  },
  {
    label: "Interviews",
    path: "/recruiter/interviews",
    icon: CalendarDays,
  },
  {
    label: "Company Profile",
    path: "/recruiter/company-profile",
    icon: Building2,
  },
];

const jobs = [
  {
    title: "Node.js Backend Developer",
    applications: 124,
    views: 1842,
    shortlisted: 18,
    interviews: 8,
    hired: 2,
    vacancies: 3,
  },
  {
    title: "React Frontend Developer",
    applications: 86,
    views: 1201,
    shortlisted: 12,
    interviews: 5,
    hired: 1,
    vacancies: 2,
  },
  {
    title: "Product Designer",
    applications: 54,
    views: 890,
    shortlisted: 9,
    interviews: 3,
    hired: 0,
    vacancies: 1,
  },
];

export default function RecruiterDashboard() {
  return (
    <DashboardLayout
      title="Recruiter Dashboard"
      navItems={navItems}
    >
      <div className="mx-auto max-w-7xl">
        {/* Dashboard heading */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm text-slate-500">
              Welcome back, Rahul
            </p>

            <h2 className="mt-1 text-2xl font-black text-[#172b4d]">
              Hiring overview
            </h2>
          </div>

          <Link
            to="/recruiter/jobs/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0066b3] px-5 py-3 text-sm font-extrabold text-white"
          >
            <Plus size={17} />
            Post a Job
          </Link>
        </div>

        {/* Dashboard statistics */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["12", "Active Jobs", BriefcaseBusiness],
            ["486", "Applications", Users],
            ["42", "Shortlisted", ArrowUpRight],
            ["18", "Interviews", CalendarDays],
          ].map(([value, label, Icon]) => (
            <div
              key={label}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0066b3]">
                <Icon size={19} />
              </div>

              <p className="mt-5 text-2xl font-black text-[#172b4d]">
                {value}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Recruiter quick actions */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2">
          <Link
            to="/recruiter/jobs"
            className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition-colors hover:border-blue-300"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0066b3]">
              <BriefcaseBusiness size={22} />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="font-extrabold text-[#172b4d]">
                Manage Jobs
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Create, edit and manage job postings.
              </p>
            </div>

            <ArrowUpRight
              size={19}
              className="text-slate-400 transition-colors group-hover:text-[#0066b3]"
            />
          </Link>

          <Link
            to="/recruiter/company-profile"
            className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition-colors hover:border-blue-300"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0066b3]">
              <Building2 size={22} />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="font-extrabold text-[#172b4d]">
                Company Profile
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Update your company details and information.
              </p>
            </div>

            <ArrowUpRight
              size={19}
              className="text-slate-400 transition-colors group-hover:text-[#0066b3]"
            />
          </Link>
        </section>

        {/* Job performance table */}
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 p-6">
            <div>
              <h3 className="font-extrabold text-[#172b4d]">
                Job Performance
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Track applications, reach and hiring progress.
              </p>
            </div>

            <Link
              to="/recruiter/jobs"
              className="text-xs font-bold text-[#0066b3]"
            >
              Manage jobs
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                  <th className="px-6 py-4">Job</th>
                  <th className="px-4 py-4">Views</th>
                  <th className="px-4 py-4">Applications</th>
                  <th className="px-4 py-4">Shortlisted</th>
                  <th className="px-4 py-4">Interviews</th>
                  <th className="px-4 py-4">Vacancies</th>
                </tr>
              </thead>

              <tbody>
                {jobs.map((job) => (
                  <tr
                    key={job.title}
                    className="border-b border-slate-50 last:border-0"
                  >
                    <td className="px-6 py-5">
                      <p className="font-bold text-[#172b4d]">
                        {job.title}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Active
                      </p>
                    </td>

                    <td className="px-4 py-5">
                      <span className="flex items-center gap-1 text-sm font-semibold text-slate-600">
                        <Eye size={15} />
                        {job.views.toLocaleString()}
                      </span>
                    </td>

                    <td className="px-4 py-5 text-sm font-bold text-[#172b4d]">
                      {job.applications}
                    </td>

                    <td className="px-4 py-5 text-sm font-bold text-[#172b4d]">
                      {job.shortlisted}
                    </td>

                    <td className="px-4 py-5 text-sm font-bold text-[#172b4d]">
                      {job.interviews}
                    </td>

                    <td className="px-4 py-5">
                      <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-[#0066b3]">
                        {job.vacancies - job.hired} remaining
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
