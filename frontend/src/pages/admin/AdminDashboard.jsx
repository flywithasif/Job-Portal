import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Clock3,
  FileCheck2,
  RefreshCw,
  ShieldCheck,
  UserRoundCheck,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import api from "../../services/api";
// ============================================================
// ADMIN NAVIGATION
// ============================================================
const baseNavItems = [
  {
    label: "Dashboard",
    path: "/admin",
    icon: Activity,
  },
  {
    label: "Users",
    path: "/admin/users",
    icon: Users,
  },
  {
    label: "Companies",
    path: "/admin/companies",
    icon: Building2,
  },
  {
    label: "Jobs",
    path: "/admin/jobs",
    icon: BriefcaseBusiness,
  },
  {
    label: "Applications",
    path: "/admin/applications",
    icon: FileCheck2,
  },
  {
    label: "Moderation",
    path: "/admin/moderation",
    icon: ShieldCheck,
  },
];
// ============================================================
// HELPERS
// ============================================================
function getStoredUser() {
  try {
    const storedUser = localStorage.getItem("job_portal_user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
}
function formatNumber(value) {
  return new Intl.NumberFormat("en-IN").format(
    Number(value) || 0,
  );
}
// ============================================================
// STAT CARD
// ============================================================
function StatCard({
  label,
  value,
  description,
  icon: Icon,
  iconClassName,
  path,
}) {
  const content = (
    <div className="group relative flex min-h-[178px] min-w-0 flex-col justify-between overflow-hidden p-5 sm:p-6">
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-slate-50 transition-transform duration-500 group-hover:scale-125" />
      <div className="relative flex min-w-0 items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-xs font-extrabold uppercase tracking-[0.14em] text-slate-400">
            {label}
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-[#172b4d] sm:text-[34px]">
            {formatNumber(value)}
          </h2>
          <p className="mt-2 line-clamp-2 text-xs font-medium leading-5 text-slate-400">
            {description}
          </p>
        </div>
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconClassName} shadow-sm transition-transform duration-300 group-hover:scale-105`}
        >
          <Icon size={21} strokeWidth={2.2} />
        </div>
      </div>
      <div className="relative mt-5 flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
          View details
        </span>
        <span className="text-sm font-black text-[#0066b3] transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </div>
    </div>
  );
  if (!path) {
    return (
      <article className="min-w-0 overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-sm">
        {content}
      </article>
    );
  }
  return (
    <Link
      to={path}
      aria-label={`View ${label}`}
      className="block min-w-0 overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-sm outline-none transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_18px_45px_rgba(15,23,42,0.10)] focus-visible:ring-2 focus-visible:ring-[#0066b3] focus-visible:ring-offset-2 active:translate-y-0"
    >
      {content}
    </Link>
  );
}
function SectionHeader({ eyebrow, title, action }) {
  return (
    <div className="flex min-w-0 flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-blue-700">
          {eyebrow}
        </p>
        <h2 className="mt-1 truncate text-lg font-black tracking-tight text-[#172b4d]">
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}
// ============================================================
// EMPTY STATE
// ============================================================
function EmptyState({ title, description }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-7 text-center">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm">
        <CheckCircle2 size={21} />
      </div>
      <h3 className="mt-4 text-sm font-bold text-slate-700">
        {title}
      </h3>
      <p className="mx-auto mt-1 max-w-md text-xs leading-5 text-slate-400">
        {description}
      </p>
    </div>
  );
}
// ============================================================
// LOADING SKELETON
// ============================================================
function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <section className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-[158px] animate-pulse rounded-2xl border border-slate-200 bg-white p-5"
          >
            <div className="flex justify-between">
              <div className="space-y-3">
                <div className="h-4 w-28 rounded bg-slate-100" />
                <div className="h-9 w-20 rounded bg-slate-100" />
                <div className="h-3 w-40 rounded bg-slate-100" />
              </div>
              <div className="h-12 w-12 rounded-xl bg-slate-100" />
            </div>
          </div>
        ))}
      </section>
      <section className="grid min-w-0 grid-cols-1 gap-6 2xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,1fr)]">
        <div className="h-[300px] animate-pulse rounded-2xl border border-slate-200 bg-white" />
        <div className="h-[300px] animate-pulse rounded-2xl border border-slate-200 bg-white" />
      </section>
    </div>
  );
}
// ============================================================
// ADMIN DASHBOARD
// ============================================================
export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const currentUser = useMemo(
    () => getStoredUser(),
    [],
  );
  const isSuperAdmin =
    currentUser?.role === "SUPER_ADMIN";
  // ==========================================================
  // NAVIGATION
  // ==========================================================
  const navItems = useMemo(() => {
    if (!isSuperAdmin) {
      return baseNavItems;
    }
    return [
      ...baseNavItems,
      {
        label: "Admin Management",
        path: "/admin/admins",
        icon: UserRoundCheck,
      },
    ];
  }, [isSuperAdmin]);
  // ==========================================================
  // LOAD DASHBOARD
  // ==========================================================
  const loadDashboard = async (
    showRefreshState = false,
  ) => {
    try {
      if (showRefreshState) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError("");
      const response = await api.get(
        "/admin/dashboard",
      );
      const data = response?.data?.data || {};
      setDashboard(data);
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to load admin dashboard.";
      setError(message);
      if (showRefreshState) {
        toast.error(message);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  useEffect(() => {
    loadDashboard();
  }, []);
  // ==========================================================
  // DATA
  // ==========================================================
  const users = dashboard?.users || {};
  const jobs = dashboard?.jobs || {};
  const companies = dashboard?.companies || {};
  const applications =
    dashboard?.applications || {};
  const closedJobs = Math.max(
    0,
    (jobs.total || 0) - (jobs.open || 0),
  );
  const processedApplications = Math.max(
    0,
    (applications.total || 0) -
      (applications.pending || 0),
  );
  // ==========================================================
  // STAT CARDS
  // ==========================================================
  const statCards = [
    {
      label: "Total Users",
      path: "/admin/users",
      value: users.total,
      description: `${formatNumber(
        users.jobSeekers,
      )} job seekers · ${formatNumber(
        users.recruiters,
      )} recruiters`,
      icon: Users,
      iconClassName:
        "bg-blue-50 text-blue-700",
    },
    {
      label: "Recruiters",
      path: "/admin/users",
      value: users.recruiters,
      description:
        "Recruiter accounts registered on the platform",
      icon: UserRoundCheck,
      iconClassName:
        "bg-violet-50 text-violet-700",
    },
    {
      label: "Open Jobs",
      path: "/admin/jobs",
      value: jobs.open,
      description: `${formatNumber(
        jobs.total,
      )} total jobs currently stored`,
      icon: BriefcaseBusiness,
      iconClassName:
        "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Applications",
      path: "/admin/applications",
      value: applications.total,
      description: `${formatNumber(
        applications.pending,
      )} applications currently pending`,
      icon: FileCheck2,
      iconClassName:
        "bg-amber-50 text-amber-700",
    },
  ];
  // ==========================================================
  // RENDER
  // ==========================================================
  return (
    <DashboardLayout
      title="Platform Overview"
      navItems={navItems}
    >
      {/* ======================================================
          IMPORTANT:
          min-w-0 + w-full + overflow-hidden prevents
          dashboard content from creating horizontal overflow.
      ====================================================== */}
      <main className="w-full min-w-0 max-w-none overflow-hidden pb-8">
        <div className="mx-auto w-full min-w-0 max-w-[1500px] space-y-6 px-4 sm:px-6 lg:px-7 xl:px-8">
          {/* ==================================================
              PAGE HEADER
          ================================================== */}
          <section className="flex min-w-0 flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:p-6">
            <div className="min-w-0">
              <div className="flex min-w-0 items-center gap-2 text-sm font-semibold text-slate-500">
                <ShieldCheck
                  size={17}
                  className="shrink-0 text-blue-700"
                />
                <span className="truncate">
                  Administration / Overview
                </span>
              </div>
              <h1 className="mt-2 text-2xl font-black tracking-tight text-[#172b4d] sm:text-3xl">
                Platform overview
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Monitor your hiring marketplace using
                live platform data and manage the core
                administration workflow.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <div className="hidden items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 md:flex">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Live data
              </div>
              <button
                type="button"
                onClick={() =>
                  loadDashboard(true)
                }
                disabled={loading || refreshing}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw
                  size={15}
                  className={
                    refreshing
                      ? "animate-spin"
                      : ""
                  }
                />
                {refreshing
                  ? "Refreshing..."
                  : "Refresh"}
              </button>
            </div>
          </section>
          {/* ==================================================
              ERROR
          ================================================== */}
          {error && !loading && (
            <section className="rounded-2xl border border-rose-200 bg-rose-50 p-5">
              <div className="flex items-start gap-3">
                <div className="shrink-0 rounded-xl bg-white p-2 text-rose-600 shadow-sm">
                  <AlertCircle size={19} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-rose-800">
                    Dashboard could not be loaded
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-rose-700">
                    {error}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      loadDashboard()
                    }
                    className="mt-3 rounded-lg bg-rose-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-rose-700"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </section>
          )}
          {/* ==================================================
              CONTENT
          ================================================== */}
          {loading ? (
            <DashboardSkeleton />
          ) : (
            <>
              {/* ==============================================
                  MAIN STATISTICS
              ============================================== */}
              <section className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
                {statCards.map((stat) => (
                  <StatCard
                    key={stat.label}
                    {...stat}
                  />
                ))}
              </section>
              {/* ==============================================
                  PLATFORM OVERVIEW
              ============================================== */}
              <section className="grid min-w-0 grid-cols-1 gap-6 2xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,1fr)]">
                {/* Marketplace */}
                <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <SectionHeader
                    eyebrow="Platform snapshot"
                    title="Current marketplace overview"
                    action={
                      <span className="rounded-lg border border-slate-200 px-3 py-2 text-[11px] font-bold text-slate-500">
                        Live database
                      </span>
                    }
                  />
                  <div className="mt-6 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
                    {/* Job Seekers */}
                    <div className="min-w-0 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-bold text-slate-500">
                          Job Seekers
                        </span>
                        <Users
                          size={17}
                          className="shrink-0 text-blue-600"
                        />
                      </div>
                      <p className="mt-3 text-2xl font-black text-[#172b4d]">
                        {formatNumber(
                          users.jobSeekers,
                        )}
                      </p>
                    </div>
                    {/* Recruiters */}
                    <div className="min-w-0 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-bold text-slate-500">
                          Recruiters
                        </span>
                        <UserRoundCheck
                          size={17}
                          className="shrink-0 text-violet-600"
                        />
                      </div>
                      <p className="mt-3 text-2xl font-black text-[#172b4d]">
                        {formatNumber(
                          users.recruiters,
                        )}
                      </p>
                    </div>
                    {/* Jobs */}
                    <div className="min-w-0 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-bold text-slate-500">
                          Total Jobs
                        </span>
                        <BriefcaseBusiness
                          size={17}
                          className="shrink-0 text-emerald-600"
                        />
                      </div>
                      <p className="mt-3 text-2xl font-black text-[#172b4d]">
                        {formatNumber(
                          jobs.total,
                        )}
                      </p>
                    </div>
                    {/* Companies */}
                    <div className="min-w-0 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-bold text-slate-500">
                          Companies
                        </span>
                        <Building2
                          size={17}
                          className="shrink-0 text-amber-600"
                        />
                      </div>
                      <p className="mt-3 text-2xl font-black text-[#172b4d]">
                        {formatNumber(
                          companies.total,
                        )}
                      </p>
                    </div>
                  </div>
                </article>
                {/* Platform Health */}
                <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <SectionHeader
                    eyebrow="Platform health"
                    title="Current queue"
                  />
                  <div className="mt-6 space-y-3">
                    {/* Pending */}
                    <div className="flex min-w-0 items-center gap-3 rounded-xl border border-amber-100 bg-amber-50/60 p-4">
                      <div className="shrink-0 rounded-xl bg-white p-3 text-amber-700 shadow-sm">
                        <Clock3 size={19} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-slate-800">
                          Pending applications
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          Applications waiting for recruiter
                          review.
                        </p>
                      </div>
                      <span className="shrink-0 text-xl font-black text-[#172b4d]">
                        {formatNumber(
                          applications.pending,
                        )}
                      </span>
                    </div>
                    {/* Open Jobs */}
                    <div className="flex min-w-0 items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
                      <div className="shrink-0 rounded-xl bg-white p-3 text-emerald-700 shadow-sm">
                        <CheckCircle2 size={19} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-slate-800">
                          Open jobs
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          Job listings currently open on
                          the platform.
                        </p>
                      </div>
                      <span className="shrink-0 text-xl font-black text-[#172b4d]">
                        {formatNumber(jobs.open)}
                      </span>
                    </div>
                    {/* Companies */}
                    <div className="flex min-w-0 items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/60 p-4">
                      <div className="shrink-0 rounded-xl bg-white p-3 text-blue-700 shadow-sm">
                        <Building2 size={19} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-slate-800">
                          Registered companies
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          Companies currently stored in the
                          platform.
                        </p>
                      </div>
                      <span className="shrink-0 text-xl font-black text-[#172b4d]">
                        {formatNumber(
                          companies.total,
                        )}
                      </span>
                    </div>
                  </div>
                </article>
              </section>
              {/* ==============================================
                  BREAKDOWN
              ============================================== */}
              <section className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Users */}
                <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <SectionHeader
                    eyebrow="Users"
                    title="Account breakdown"
                  />
                  <div className="mt-5 space-y-3">
                    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                      <span className="text-sm font-semibold text-slate-600">
                        Job Seekers
                      </span>
                      <span className="text-sm font-black text-[#172b4d]">
                        {formatNumber(
                          users.jobSeekers,
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                      <span className="text-sm font-semibold text-slate-600">
                        Recruiters
                      </span>
                      <span className="text-sm font-black text-[#172b4d]">
                        {formatNumber(
                          users.recruiters,
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                      <span className="text-sm font-semibold text-slate-600">
                        Admins
                      </span>
                      <span className="text-sm font-black text-[#172b4d]">
                        {formatNumber(users.admins)}
                      </span>
                    </div>
                  </div>
                </article>
                {/* Jobs */}
                <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <SectionHeader
                    eyebrow="Jobs"
                    title="Job marketplace"
                  />
                  <div className="mt-5 space-y-3">
                    <div className="flex items-center justify-between rounded-xl bg-emerald-50/60 px-4 py-3">
                      <span className="text-sm font-semibold text-slate-600">
                        Open
                      </span>
                      <span className="text-sm font-black text-emerald-700">
                        {formatNumber(jobs.open)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                      <span className="text-sm font-semibold text-slate-600">
                        Closed
                      </span>
                      <span className="text-sm font-black text-[#172b4d]">
                        {formatNumber(closedJobs)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-blue-50/60 px-4 py-3">
                      <span className="text-sm font-semibold text-slate-600">
                        Total
                      </span>
                      <span className="text-sm font-black text-blue-700">
                        {formatNumber(jobs.total)}
                      </span>
                    </div>
                  </div>
                </article>
                {/* Applications */}
                <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <SectionHeader
                    eyebrow="Applications"
                    title="Application pipeline"
                  />
                  <div className="mt-5 space-y-3">
                    <div className="flex items-center justify-between rounded-xl bg-amber-50/60 px-4 py-3">
                      <span className="text-sm font-semibold text-slate-600">
                        Pending
                      </span>
                      <span className="text-sm font-black text-amber-700">
                        {formatNumber(
                          applications.pending,
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-blue-50/60 px-4 py-3">
                      <span className="text-sm font-semibold text-slate-600">
                        Total Applications
                      </span>
                      <span className="text-sm font-black text-blue-700">
                        {formatNumber(
                          applications.total,
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                      <span className="text-sm font-semibold text-slate-600">
                        Processed
                      </span>
                      <span className="text-sm font-black text-[#172b4d]">
                        {formatNumber(
                          processedApplications,
                        )}
                      </span>
                    </div>
                  </div>
                </article>
              </section>
              {/* ==============================================
                  ADMIN ACCESS
              ============================================== */}
              <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#172b4d] text-white">
                      <ShieldCheck size={21} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">
                        Access level
                      </p>
                      <h2 className="mt-1 text-lg font-black text-[#172b4d]">
                        {isSuperAdmin
                          ? "SUPER ADMIN"
                          : "ADMIN"}
                      </h2>
                      <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">
                        {isSuperAdmin
                          ? "You have full platform administration access, including admin management."
                          : "You have administrator access to platform management and moderation."}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`inline-flex w-fit shrink-0 items-center gap-2 rounded-full px-3 py-2 text-xs font-bold ${
                      isSuperAdmin
                        ? "bg-violet-50 text-violet-700"
                        : "bg-blue-50 text-blue-700"
                    }`}
                  >
                    <span className="h-2 w-2 rounded-full bg-current" />
                    {isSuperAdmin
                      ? "Full control"
                      : "Administrator"}
                  </div>
                </div>
              </section>

              {/* ==============================================
                  VERIFIED DATA NOTE
              ============================================== */}

              <section>
                <EmptyState
                  title="Dashboard is using verified platform data"
                  description="Activity feeds, review history and advanced analytics will be added from dedicated admin APIs instead of showing fake records."
                />
              </section>
            </>
          )}
        </div>
      </main>
    </DashboardLayout>
  );
}
