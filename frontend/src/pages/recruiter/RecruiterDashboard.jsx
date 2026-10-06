import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  Loader2,
  Plus,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";

import { getMyJobs } from "../../services/jobService";
import { getJobApplications } from "../../services/applicationService";
import { getRecruiterInterviews } from "../../services/interviewService";
import { getMyCompany } from "../../services/companyService";

function getApiErrorMessage(error, fallback) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    fallback
  );
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function StatCard({
  label,
  value,
  icon: Icon,
  tone,
  helper,
}) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_14px_35px_rgba(15,23,42,0.08)]">
      <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-slate-50/70 blur-2xl" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">
            {label}
          </p>

          <p className="mt-3 text-3xl font-black tracking-tight text-[#172b4d]">
            {value.toLocaleString("en-IN")}
          </p>
        </div>

        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tone}`}
        >
          <Icon size={20} strokeWidth={2.2} />
        </span>
      </div>

      <p className="relative mt-3 text-xs font-medium text-slate-400">
        {helper}
      </p>
    </article>
  );
}

function QuickAction({
  to,
  icon: Icon,
  title,
  description,
  iconClassName,
}) {
  return (
    <Link
      to={to}
      className="group flex min-w-0 items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.03)] transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_14px_35px_rgba(15,23,42,0.07)]"
    >
      <span
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}
      >
        <Icon size={21} strokeWidth={2.2} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-extrabold text-[#172b4d] sm:text-base">
          {title}
        </span>

        <span className="mt-1 block text-xs leading-5 text-slate-500 sm:text-sm">
          {description}
        </span>
      </span>

      <ArrowUpRight
        size={18}
        className="shrink-0 text-slate-300 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#0066b3]"
      />
    </Link>
  );
}

export default function RecruiterDashboard() {
  const { user } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [company, setCompany] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      try {
        setLoading(true);

        const [
          jobsResponse,
          companyResponse,
          interviewsResponse,
        ] = await Promise.all([
          getMyJobs({
            page: 1,
            limit: 100,
          }),

          getMyCompany().catch(() => null),

          getRecruiterInterviews({
            page: 1,
            limit: 100,
          }).catch(() => ({
            data: [],
          })),
        ]);

        const backendJobs = Array.isArray(jobsResponse?.data)
          ? jobsResponse.data
          : [];

        const backendInterviews = Array.isArray(
          interviewsResponse?.data,
        )
          ? interviewsResponse.data
          : [];

        if (!mounted) return;

        setJobs(backendJobs);
        setInterviews(backendInterviews);

        setCompany(
          companyResponse?.data?.company ||
            companyResponse?.data ||
            null,
        );

        const applicationResults = await Promise.all(
          backendJobs.map(async (job) => {
            const jobId = job?._id || job?.id;

            if (!jobId) {
              return [];
            }

            try {
              const response = await getJobApplications(jobId, {
                page: 1,
                limit: 100,
              });

              return Array.isArray(response?.data)
                ? response.data
                : [];
            } catch {
              return [];
            }
          }),
        );

        if (mounted) {
          setApplications(applicationResults.flat());
        }
      } catch (error) {
        if (mounted) {
          toast.error(
            getApiErrorMessage(
              error,
              "Unable to load recruiter dashboard.",
            ),
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    return {
      activeJobs: jobs.filter(
        (job) => job.status === "OPEN",
      ).length,

      applications: applications.length,

      shortlisted: applications.filter(
        (application) =>
          application.status === "SHORTLISTED",
      ).length,

      interviews: interviews.filter(
        (interview) =>
          interview.status === "SCHEDULED",
      ).length,
    };
  }, [jobs, applications, interviews]);

  const performance = useMemo(() => {
    return jobs.slice(0, 8).map((job) => {
      const jobId = String(job?._id || job?.id);

      const jobApplications = applications.filter(
        (application) =>
          String(
            application?.job?._id ||
              application?.job?.id ||
              application?.job,
          ) === jobId,
      );

      return {
        ...job,

        applicationCount: jobApplications.length,

        shortlisted: jobApplications.filter(
          (application) =>
            application.status === "SHORTLISTED",
        ).length,

        interviews: jobApplications.filter(
          (application) =>
            application.status === "REVIEWING",
        ).length,
      };
    });
  }, [jobs, applications]);

  if (loading) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center px-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
            <Loader2
              size={22}
              className="animate-spin text-[#0066b3]"
            />
          </div>

          <p className="text-sm font-semibold text-slate-500">
            Loading recruiter dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 overflow-hidden">
      <div className="mx-auto w-full max-w-[1440px] space-y-6 px-4 pb-8 sm:px-6 lg:px-8 xl:px-10">
        {/* =========================================================
            HERO / WELCOME
        ========================================================== */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_10px_40px_rgba(15,23,42,0.05)]">
          <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-blue-50/80 blur-3xl" />

          <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-indigo-50/50 blur-3xl" />

          <div className="relative flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:p-9">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold text-[#0066b3]">
                  Recruiter workspace
                </span>

                {company?.name && (
                  <span className="max-w-full truncate rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500">
                    {company.name}
                  </span>
                )}
              </div>

              <p className="mt-5 text-sm font-medium text-slate-500">
                Welcome back,{" "}
                <span className="font-bold text-slate-700">
                  {user?.name || "Recruiter"}
                </span>
              </p>

              <h2 className="mt-1 text-3xl font-black tracking-tight text-[#172b4d] sm:text-4xl">
                Hiring overview
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Manage your jobs, review candidates and
                keep your hiring pipeline moving.
              </p>
            </div>

            <div className="shrink-0">
              <Link
                to="/recruiter/jobs"
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0066b3] px-5 py-3 text-sm font-bold text-white shadow-[0_8px_20px_rgba(0,102,179,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#005596] hover:shadow-[0_12px_25px_rgba(0,102,179,0.25)] sm:w-auto"
              >
                <Plus size={17} strokeWidth={2.5} />
                Post a Job
              </Link>
            </div>
          </div>
        </section>

        {/* =========================================================
            STATISTICS
        ========================================================== */}
        <section className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
            helper="Candidates who applied"
          />

          <StatCard
            label="Shortlisted"
            value={stats.shortlisted}
            icon={CheckCircle2}
            tone="bg-emerald-50 text-emerald-700"
            helper="Candidates moved forward"
          />

          <StatCard
            label="Upcoming interviews"
            value={stats.interviews}
            icon={CalendarDays}
            tone="bg-amber-50 text-amber-700"
            helper="Currently scheduled"
          />
        </section>

        {/* =========================================================
            QUICK ACTIONS
        ========================================================== */}
        <section>
          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0066b3]">
              Workspace
            </p>

            <h3 className="mt-1 text-xl font-black tracking-tight text-[#172b4d]">
              Quick actions
            </h3>
          </div>

          <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-3">
            <QuickAction
              to="/recruiter/jobs"
              icon={BriefcaseBusiness}
              title="Manage jobs"
              description="Create, edit, close and remove postings."
              iconClassName="bg-blue-50 text-[#0066b3]"
            />

            <QuickAction
              to="/recruiter/applicants"
              icon={Users}
              title="Review applicants"
              description="Search candidates and update application status."
              iconClassName="bg-violet-50 text-violet-700"
            />

            <QuickAction
              to="/recruiter/company-profile"
              icon={Building2}
              title="Company profile"
              description="Keep employer information updated."
              iconClassName="bg-emerald-50 text-emerald-700"
            />
          </div>
        </section>

        {/* =========================================================
            JOB PERFORMANCE
        ========================================================== */}
        <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#0066b3]" />

                <h3 className="font-black text-[#172b4d]">
                  Job performance
                </h3>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                Live data from your jobs and applications.
              </p>
            </div>

            <Link
              to="/recruiter/jobs"
              className="inline-flex w-fit items-center gap-1 text-sm font-bold text-[#0066b3] transition hover:text-[#005596] hover:underline"
            >
              Manage jobs
              <ArrowUpRight size={15} />
            </Link>
          </div>

          {performance.length === 0 ? (
            <div className="px-6 py-14 text-center sm:px-10">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-300">
                <BriefcaseBusiness size={28} />
              </div>

              <p className="mt-4 font-bold text-slate-600">
                No job postings yet
              </p>

              <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-slate-400">
                Create your first job posting to start
                receiving applications.
              </p>

              <Link
                to="/recruiter/jobs"
                className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[#0066b3] hover:underline"
              >
                Create your first job
                <ArrowUpRight size={15} />
              </Link>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">
                    <th className="px-5 py-4">
                      Job
                    </th>

                    <th className="px-4 py-4">
                      Status
                    </th>

                    <th className="px-4 py-4">
                      Applications
                    </th>

                    <th className="px-4 py-4">
                      Shortlisted
                    </th>

                    <th className="px-4 py-4">
                      Interviews
                    </th>

                    <th className="px-4 py-4">
                      Posted
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {performance.map((job) => (
                    <tr
                      key={job._id || job.id}
                      className="transition-colors hover:bg-slate-50/70"
                    >
                      <td className="px-5 py-4">
                        <div className="min-w-0">
                          <p className="max-w-[260px] truncate font-bold text-[#172b4d]">
                            {job.title}
                          </p>

                          <p className="mt-1 max-w-[260px] truncate text-xs text-slate-400">
                            {job.location ||
                              "Location not specified"}
                          </p>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${
                            job.status === "OPEN"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {job.status === "OPEN"
                            ? "Open"
                            : "Closed"}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span className="font-bold text-slate-700">
                          {job.applicationCount}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span className="font-bold text-slate-700">
                          {job.shortlisted}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span className="font-bold text-slate-700">
                          {job.interviews}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-500">
                        {formatDate(job.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}