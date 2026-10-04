
import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  Eye,
  Plus,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../components/DashboardLayout";
import {
  readRecruiterData,
  RECRUITER_STORAGE_KEYS,
} from "../../utils/recruiterStorage";

const navItems = [
  { label: "Dashboard", path: "/recruiter", icon: BarChart3 },
  { label: "My Jobs", path: "/recruiter/jobs", icon: BriefcaseBusiness },
  { label: "Applicants", path: "/recruiter/applicants", icon: Users },
  { label: "Interviews", path: "/recruiter/interviews", icon: CalendarDays },
  {
    label: "Company Profile",
    path: "/recruiter/company-profile",
    icon: Building2,
  },
];

const demoJobs = [
  {
    id: 1,
    title: "Junior Backend Developer",
    status: "Active",
    applicants: 24,
    openings: "2",
    posted: "2026-10-01",
  },
  {
    id: 2,
    title: "MERN Stack Developer",
    status: "Active",
    applicants: 38,
    openings: "3",
    posted: "2026-09-28",
  },
  {
    id: 3,
    title: "Frontend Developer Intern",
    status: "Closed",
    applicants: 16,
    openings: "2",
    posted: "2026-09-20",
  },
];

const demoApplicants = [
  {
    id: 1,
    name: "Rahul Verma",
    job: "Junior Backend Developer",
    status: "Applied",
  },
  {
    id: 2,
    name: "Priya Sharma",
    job: "MERN Stack Developer",
    status: "Shortlisted",
  },
  {
    id: 3,
    name: "Aman Singh",
    job: "Junior Backend Developer",
    status: "Interview",
  },
  {
    id: 4,
    name: "Neha Gupta",
    job: "Frontend Developer Intern",
    status: "Rejected",
  },
  {
    id: 5,
    name: "Vikram Yadav",
    job: "MERN Stack Developer",
    status: "Applied",
  },
  {
    id: 6,
    name: "Ananya Mehta",
    job: "Junior Backend Developer",
    status: "Shortlisted",
  },
];

function getRecruiterName() {
  try {
    const user = JSON.parse(
      localStorage.getItem("job_portal_user") || "null",
    );

    return user?.name || "Recruiter";
  } catch {
    return "Recruiter";
  }
}

function StatCard({ label, value, icon: Icon, tone, helper }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/[0.02]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{label}</p>

          <p className="mt-3 text-3xl font-black tracking-tight text-[#172b4d]">
            {value.toLocaleString("en-IN")}
          </p>
        </div>

        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tone}`}
        >
          <Icon size={20} />
        </span>
      </div>

      <p className="mt-3 text-xs text-slate-400">{helper}</p>
    </article>
  );
}

export default function RecruiterDashboard() {
  // Read the latest saved demo data when the dashboard mounts.
  const [jobs] = useState(() =>
    readRecruiterData(RECRUITER_STORAGE_KEYS.jobs, demoJobs),
  );

  const [applicants] = useState(() =>
    readRecruiterData(
      RECRUITER_STORAGE_KEYS.applicants,
      demoApplicants,
    ),
  );

  const [company] = useState(() =>
    readRecruiterData(RECRUITER_STORAGE_KEYS.companyProfile, null),
  );

  const stats = useMemo(() => {
    const activeJobs = jobs.filter(
      (job) => job.status === "Active",
    ).length;

    const shortlisted = applicants.filter(
      (applicant) => applicant.status === "Shortlisted",
    ).length;

    const interviews = applicants.filter(
      (applicant) => applicant.status === "Interview",
    ).length;

    return {
      activeJobs,
      applications: applicants.length,
      shortlisted,
      interviews,
    };
  }, [jobs, applicants]);

  const performance = useMemo(
    () =>
      jobs.map((job) => {
        const jobApplicants = applicants.filter(
          (applicant) => applicant.job === job.title,
        );

        return {
          ...job,
          applicationCount:
            jobApplicants.length || Number(job.applicants) || 0,
          shortlisted: jobApplicants.filter(
            (applicant) => applicant.status === "Shortlisted",
          ).length,
          interviews: jobApplicants.filter(
            (applicant) => applicant.status === "Interview",
          ).length,
          remaining: Math.max(0, Number(job.openings) || 0),
        };
      }),
    [jobs, applicants],
  );

  return (
    <DashboardLayout title="Recruiter Dashboard" navItems={navItems}>
      <div className="mx-auto max-w-7xl space-y-7">
        {/* Welcome section */}
        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm text-slate-500">
              Welcome back, {getRecruiterName()}
              {company?.name ? ` · ${company.name}` : ""}
            </p>

            <h2 className="mt-1 text-2xl font-black tracking-tight text-[#172b4d] sm:text-3xl">
              Hiring overview
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Review your job listings, follow application progress and
              keep your hiring activity organized.
            </p>
          </div>

          <Link
            to="/recruiter/jobs"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#0066b3] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#005596] focus:outline-none focus:ring-4 focus:ring-blue-100"
          >
            <Plus size={17} />
            Post a Job
          </Link>
        </section>

        {/* Recruitment statistics */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Active jobs"
            value={stats.activeJobs}
            icon={BriefcaseBusiness}
            tone="bg-blue-50 text-[#0066b3]"
            helper="Currently open postings"
          />

          <StatCard
            label="Applications"
            value={stats.applications}
            icon={Users}
            tone="bg-violet-50 text-violet-700"
            helper="Applications in the current demo data"
          />

          <StatCard
            label="Shortlisted"
            value={stats.shortlisted}
            icon={CheckCircle2}
            tone="bg-emerald-50 text-emerald-700"
            helper="Candidates moved to shortlist"
          />

          <StatCard
            label="Interviews"
            value={stats.interviews}
            icon={CalendarDays}
            tone="bg-amber-50 text-amber-700"
            helper="Candidates marked for interview"
          />
        </section>

        {/* Quick navigation */}
        <section className="grid gap-4 lg:grid-cols-3">
          <Link
            to="/recruiter/jobs"
            className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-sm"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0066b3]">
              <BriefcaseBusiness size={22} />
            </span>

            <span className="min-w-0 flex-1">
              <span className="block font-extrabold text-[#172b4d]">
                Manage jobs
              </span>

              <span className="mt-1 block text-sm text-slate-500">
                Create, edit, close and remove postings.
              </span>
            </span>

            <ArrowUpRight
              size={19}
              className="text-slate-400 transition group-hover:text-[#0066b3]"
            />
          </Link>

          <Link
            to="/recruiter/applicants"
            className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-sm"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
              <Users size={22} />
            </span>

            <span className="min-w-0 flex-1">
              <span className="block font-extrabold text-[#172b4d]">
                Review applicants
              </span>

              <span className="mt-1 block text-sm text-slate-500">
                Search candidates and update their status.
              </span>
            </span>

            <ArrowUpRight
              size={19}
              className="text-slate-400 transition group-hover:text-[#0066b3]"
            />
          </Link>

          <Link
            to="/recruiter/company-profile"
            className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-sm"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <Building2 size={22} />
            </span>

            <span className="min-w-0 flex-1">
              <span className="block font-extrabold text-[#172b4d]">
                Company profile
              </span>

              <span className="mt-1 block text-sm text-slate-500">
                Maintain your employer information.
              </span>
            </span>

            <ArrowUpRight
              size={19}
              className="text-slate-400 transition group-hover:text-[#0066b3]"
            />
          </Link>
        </section>

        {/* Job performance table */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex flex-col gap-2 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <h3 className="font-extrabold text-[#172b4d]">
                Job performance
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                A summary based on the job and applicant data available
                in this browser.
              </p>
            </div>

            <Link
              to="/recruiter/jobs"
              className="inline-flex items-center gap-1 text-sm font-bold text-[#0066b3] hover:underline"
            >
              Manage jobs
              <ArrowUpRight size={15} />
            </Link>
          </div>

          {performance.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-5 py-4 font-bold">Job</th>
                    <th className="px-4 py-4 font-bold">Status</th>
                    <th className="px-4 py-4 font-bold">Applications</th>
                    <th className="px-4 py-4 font-bold">Shortlisted</th>
                    <th className="px-4 py-4 font-bold">Interviews</th>
                    <th className="px-4 py-4 font-bold">Openings</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {performance.map((job) => (
                    <tr
                      key={job.id}
                      className="transition hover:bg-slate-50/70"
                    >
                      <td className="px-5 py-4">
                        <p className="font-bold text-[#172b4d]">
                          {job.title}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {job.posted
                            ? `Posted ${job.posted}`
                            : "Draft posting"}
                        </p>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${
                            job.status === "Active"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {job.status || "Active"}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-sm font-bold text-[#172b4d]">
                        <span className="inline-flex items-center gap-1.5">
                          <Eye size={14} className="text-slate-400" />
                          {job.applicationCount}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-sm font-semibold text-slate-700">
                        {job.shortlisted}
                      </td>

                      <td className="px-4 py-4 text-sm font-semibold text-slate-700">
                        {job.interviews}
                      </td>

                      <td className="px-4 py-4 text-sm font-semibold text-slate-700">
                        {job.remaining}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-5 py-14 text-center">
              <BriefcaseBusiness
                className="mx-auto text-slate-300"
                size={30}
              />

              <h4 className="mt-3 font-bold text-slate-800">
                No job postings yet
              </h4>

              <p className="mt-1 text-sm text-slate-500">
                Create your first job to start building your hiring pipeline.
              </p>

              <Link
                to="/recruiter/jobs"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#0066b3] px-4 py-2.5 text-sm font-bold text-white"
              >
                <Plus size={16} />
                Post a job
              </Link>
            </div>
          )}
        </section>

        <p className="text-xs leading-5 text-slate-400">
          Demo limitation: recruiter data is stored in this browser only.
          Real multi-user hiring, applicant privacy and cross-device syncing
          require backend APIs and server-side authorization.
        </p>
      </div>
    </DashboardLayout>
  );
}
