import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Loader2,
  Plus,
  Sparkles,
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
  helper,
  icon: Icon,
  iconWrapper,
  accent,
}) {
  return (
    <article className="group relative overflow-hidden rounded-[22px] border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.035)] transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
      <div
        className={`absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl opacity-60 ${accent}`}
      />

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-slate-500">
            {label}
          </p>

          <p className="mt-3 text-[32px] font-black leading-none tracking-[-0.04em] text-[#172b4d]">
            {value.toLocaleString("en-IN")}
          </p>

          <p className="mt-3 text-xs font-medium text-slate-400">
            {helper}
          </p>
        </div>

        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] ${iconWrapper}`}
        >
          <Icon size={20} strokeWidth={2.2} />
        </span>
      </div>
    </article>
  );
}

function QuickAction({
  to,
  icon: Icon,
  title,
  description,
  eyebrow,
  iconWrapper,
}) {
  return (
    <Link
      to={to}
      className="group relative overflow-hidden rounded-[22px] border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.035)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
    >
      <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-slate-50 blur-3xl transition-all duration-300 group-hover:bg-blue-50" />

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <span
            className={`flex h-11 w-11 items-center justify-center rounded-[14px] ${iconWrapper}`}
          >
            <Icon size={20} strokeWidth={2.2} />
          </span>

          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition-all duration-300 group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-[#0066b3]">
            <ArrowUpRight size={16} />
          </span>
        </div>

        <p className="mt-5 text-[10px] font-black uppercase tracking-[0.18em] text-[#0066b3]">
          {eyebrow}
        </p>

        <h3 className="mt-1.5 text-base font-black tracking-tight text-[#172b4d]">
          {title}
        </h3>

        <p className="mt-2 max-w-[270px] text-sm leading-6 text-slate-500">
          {description}
        </p>

        <div className="mt-5 flex items-center gap-1 text-xs font-bold text-slate-400 transition-colors group-hover:text-[#0066b3]">
          Open workspace
          <ChevronRight
            size={14}
            className="transition-transform group-hover:translate-x-0.5"
          />
        </div>
      </div>
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
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="flex flex-col items-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.07)]">
            <Loader2
              size={22}
              className="animate-spin text-[#0066b3]"
            />
          </div>

          <p className="mt-4 text-sm font-semibold text-slate-500">
            Loading your hiring workspace...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 overflow-hidden bg-transparent">
      <div className="mx-auto w-full max-w-[1480px] space-y-7 px-4 pb-10 sm:px-6 lg:px-8 xl:px-10">
        {/* =========================================================
            PREMIUM HERO
        ========================================================== */}
        <section className="relative overflow-hidden rounded-[28px] bg-[#0b2442] shadow-[0_20px_55px_rgba(15,23,42,0.12)]">
          {/* Background decoration */}
          <div className="absolute -right-20 -top-28 h-80 w-80 rounded-full bg-[#1687df]/25 blur-3xl" />

          <div className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-[#0066b3]/25 blur-3xl" />

          <div className="absolute right-[25%] top-1/2 h-32 w-32 -translate-y-1/2 rounded-full bg-white/5 blur-2xl" />

          <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:p-10">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[11px] font-bold text-blue-100 backdrop-blur-sm">
                  <Sparkles size={13} />
                  Recruiter workspace
                </span>

                {company?.name && (
                  <span className="max-w-[240px] truncate rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold text-slate-300">
                    {company.name}
                  </span>
                )}
              </div>

              <p className="mt-6 text-sm font-medium text-blue-100/70">
                Welcome back,{" "}
                <span className="font-bold text-white">
                  {user?.name || "Recruiter"}
                </span>
              </p>

              <h1 className="mt-2 max-w-2xl text-3xl font-black tracking-[-0.035em] text-white sm:text-4xl lg:text-[44px] lg:leading-[1.08]">
                Build your next
                <span className="text-blue-300">
                  {" "}
                  great team.
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-blue-100/70 sm:text-base">
                Manage open roles, discover strong candidates
                and keep your hiring pipeline moving from one
                place.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/recruiter/jobs"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-[#0b2442] shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-50"
                >
                  <Plus size={17} strokeWidth={2.6} />
                  Post a new job
                </Link>

                <Link
                  to="/recruiter/applicants"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/10"
                >
                  <Users size={17} />
                  View applicants
                </Link>
              </div>
            </div>

            {/* Hero summary */}
            <div className="hidden w-[250px] rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md lg:block">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-blue-100/60">
                  Hiring pulse
                </span>

                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-blue-200">
                  <Clock3 size={16} />
                </span>
              </div>

              <p className="mt-6 text-3xl font-black text-white">
                {stats.activeJobs}
              </p>

              <p className="mt-1 text-xs font-medium text-blue-100/60">
                active positions
              </p>

              <div className="mt-5 h-px bg-white/10" />

              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="text-blue-100/60">
                  Applications
                </span>

                <span className="font-bold text-white">
                  {stats.applications}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-blue-100/60">
                  Interviews
                </span>

                <span className="font-bold text-white">
                  {stats.interviews}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            OVERVIEW HEADER
        ========================================================== */}
        <div className="flex flex-col gap-1">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0066b3]">
            Overview
          </p>

          <h2 className="text-xl font-black tracking-tight text-[#172b4d]">
            Hiring at a glance
          </h2>
        </div>

        {/* =========================================================
            STATISTICS
        ========================================================== */}
        <section className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Active jobs"
            value={stats.activeJobs}
            helper="Currently open postings"
            icon={BriefcaseBusiness}
            iconWrapper="bg-blue-50 text-[#0066b3]"
            accent="bg-blue-100"
          />

          <StatCard
            label="Applications"
            value={stats.applications}
            helper="Candidates who applied"
            icon={Users}
            iconWrapper="bg-violet-50 text-violet-700"
            accent="bg-violet-100"
          />

          <StatCard
            label="Shortlisted"
            value={stats.shortlisted}
            helper="Candidates moved forward"
            icon={CheckCircle2}
            iconWrapper="bg-emerald-50 text-emerald-700"
            accent="bg-emerald-100"
          />

          <StatCard
            label="Upcoming interviews"
            value={stats.interviews}
            helper="Currently scheduled"
            icon={CalendarDays}
            iconWrapper="bg-amber-50 text-amber-700"
            accent="bg-amber-100"
          />
        </section>

        {/* =========================================================
            WORKSPACE
        ========================================================== */}
        <section>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0066b3]">
                Workspace
              </p>

              <h2 className="mt-1 text-xl font-black tracking-tight text-[#172b4d]">
                Everything you need
              </h2>
            </div>
          </div>

          <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-3">
            <QuickAction
              to="/recruiter/jobs"
              icon={BriefcaseBusiness}
              eyebrow="Jobs"
              title="Manage job postings"
              description="Create new roles, edit existing positions and control your active postings."
              iconWrapper="bg-blue-50 text-[#0066b3]"
            />

            <QuickAction
              to="/recruiter/applicants"
              icon={Users}
              eyebrow="Candidates"
              title="Review applicants"
              description="Search candidates, review applications and move the right people forward."
              iconWrapper="bg-violet-50 text-violet-700"
            />

            <QuickAction
              to="/recruiter/company-profile"
              icon={Building2}
              eyebrow="Employer"
              title="Company profile"
              description="Keep your employer information polished and ready for candidates."
              iconWrapper="bg-emerald-50 text-emerald-700"
            />
          </div>
        </section>

        {/* =========================================================
            JOB PERFORMANCE
        ========================================================== */}
        <section className="overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.045)]">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#0066b3]">
                  <BriefcaseBusiness size={16} />
                </span>

                <h2 className="text-base font-black text-[#172b4d]">
                  Job performance
                </h2>
              </div>

              <p className="mt-2 text-sm text-slate-500">
                Track how your active positions are performing.
              </p>
            </div>

            <Link
              to="/recruiter/jobs"
              className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-600 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-[#0066b3]"
            >
              View all jobs
              <ArrowUpRight size={14} />
            </Link>
          </div>

          {performance.length === 0 ? (
            <div className="px-6 py-16 text-center sm:px-10">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-300">
                <BriefcaseBusiness size={28} />
              </div>

              <h3 className="mt-5 text-base font-black text-[#172b4d]">
                Your hiring workspace is ready
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
                Create your first job posting and start
                receiving applications from candidates.
              </p>

              <Link
                to="/recruiter/jobs"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0066b3] px-5 py-3 text-sm font-bold text-white shadow-[0_8px_20px_rgba(0,102,179,0.16)] transition-all hover:-translate-y-0.5 hover:bg-[#005596]"
              >
                <Plus size={16} />
                Create your first job
              </Link>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60 text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                    <th className="px-5 py-4 sm:px-6">
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
                      className="group transition-colors hover:bg-slate-50/70"
                    >
                      <td className="px-5 py-4 sm:px-6">
                        <div className="min-w-0">
                          <p className="max-w-[280px] truncate text-sm font-bold text-[#172b4d]">
                            {job.title}
                          </p>

                          <p className="mt-1 max-w-[280px] truncate text-xs text-slate-400">
                            {job.location ||
                              "Location not specified"}
                          </p>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold ${
                            job.status === "OPEN"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              job.status === "OPEN"
                                ? "bg-emerald-500"
                                : "bg-slate-400"
                            }`}
                          />

                          {job.status === "OPEN"
                            ? "Open"
                            : "Closed"}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span className="font-black text-[#172b4d]">
                          {job.applicationCount}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span className="font-black text-[#172b4d]">
                          {job.shortlisted}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span className="font-black text-[#172b4d]">
                          {job.interviews}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-xs font-medium text-slate-500">
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