import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  FileCheck2,
  Loader2,
  MapPin,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  UserCheck,
  UserX,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";

import DashboardLayout from "../../components/DashboardLayout";
import {
  getAdminJobs,
  updateAdminJobStatus,
} from "../../services/adminService";

const STATUS_OPTIONS = [
  { label: "All status", value: "ALL" },
  { label: "Open", value: "OPEN" },
  { label: "Closed", value: "CLOSED" },
];

const BASE_NAV_ITEMS = [
  { label: "Dashboard", path: "/admin", icon: Activity },
  { label: "Users", path: "/admin/users", icon: Users },
  { label: "Companies", path: "/admin/companies", icon: Building2 },
  { label: "Jobs", path: "/admin/jobs", icon: BriefcaseBusiness },
  { label: "Applications", path: "/admin/applications", icon: FileCheck2 },
  { label: "Moderation", path: "/admin/moderation", icon: ShieldCheck },
];

const formatDate = (date) => {
  if (!date) return "—";

  try {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
};

const formatSalary = (job) => {
  if (job?.salaryMin == null && job?.salaryMax == null) {
    return "Not specified";
  }

  const min = job.salaryMin;
  const max = job.salaryMax;

  if (min != null && max != null) {
    return `₹${Number(min).toLocaleString("en-IN")} - ₹${Number(
      max,
    ).toLocaleString("en-IN")}`;
  }

  if (min != null) {
    return `From ₹${Number(min).toLocaleString("en-IN")}`;
  }

  return `Up to ₹${Number(max).toLocaleString("en-IN")}`;
};

const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (!parts.length) return "JB";
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
};

const getStatusClasses = (status) => {
  if (status === "OPEN") {
    return "border-emerald-100 bg-emerald-50 text-emerald-700";
  }

  return "border-red-100 bg-red-50 text-red-700";
};

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem("job_portal_user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
};

const StatCard = ({ label, value, detail, icon: Icon, iconClasses }) => (
  <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
    <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-slate-50 transition duration-500 group-hover:scale-150" />

    <div className="relative flex items-start justify-between gap-4">
      <div>
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">
          {label}
        </p>
        <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">
          {value}
        </p>
        <p className="mt-1 text-xs font-medium text-slate-400">{detail}</p>
      </div>

      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClasses}`}
      >
        <Icon size={20} strokeWidth={2.2} />
      </div>
    </div>
  </div>
);

const TableSkeleton = () => (
  <div className="space-y-3 p-5">
    {Array.from({ length: 6 }).map((_, index) => (
      <div
        key={index}
        className="h-16 animate-pulse rounded-xl bg-slate-100"
      />
    ))}
  </div>
);

export default function Jobs() {
  const currentUser = useMemo(() => getStoredUser(), []);
  const isSuperAdmin = currentUser?.role === "SUPER_ADMIN";

  const navItems = useMemo(
    () => [
      ...BASE_NAV_ITEMS,
      ...(isSuperAdmin
        ? [
            {
              label: "Admin Management",
              path: "/admin/admins",
              icon: ShieldCheck,
            },
          ]
        : []),
      {
        label: "Settings",
        path: "/admin/settings",
        icon: Settings,
      },
    ],
    [isSuperAdmin],
  );

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });

  const loadJobs = useCallback(async () => {
    try {
      setLoading(true);

      const params = {
        page,
        limit: 10,
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      if (status !== "ALL") {
        params.status = status;
      }

      const response = await getAdminJobs(params);
      const data = response?.data || {};

      const jobList = Array.isArray(data.jobs) ? data.jobs : [];
      const backendPagination = data.pagination || {};

      setJobs(jobList);

      setPagination({
        page: Number(backendPagination.page) || page,
        limit: Number(backendPagination.limit) || 10,
        total: Number(backendPagination.total) || jobList.length,
        pages: Math.max(Number(backendPagination.pages) || 1, 1),
      });
    } catch (error) {
      console.error("Failed to load admin jobs:", error);
      setJobs([]);

      toast.error(
        error?.response?.data?.message || "Failed to load jobs.",
      );
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    setPage(1);
  };

  const handleStatusUpdate = async (job) => {
    if (!job?._id) return;

    const nextStatus = job.status === "OPEN" ? "CLOSED" : "OPEN";
    const loadingKey = job._id;

    try {
      setActionLoading(loadingKey);

      await updateAdminJobStatus(job._id, nextStatus);

      setJobs((currentJobs) =>
        currentJobs.map((item) =>
          item._id === job._id
            ? { ...item, status: nextStatus }
            : item,
        ),
      );

      toast.success(
        `Job ${nextStatus === "OPEN" ? "opened" : "closed"} successfully.`,
      );
    } catch (error) {
      console.error("Failed to update job status:", error);

      toast.error(
        error?.response?.data?.message || "Unable to update job status.",
      );
    } finally {
      setActionLoading("");
    }
  };

  const goToPreviousPage = () => {
    if (page > 1) {
      setPage((currentPage) => currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (page < pagination.pages) {
      setPage((currentPage) => currentPage + 1);
    }
  };

  const handleRefresh = () => {
    loadJobs();
  };

  const openJobsOnPage = jobs.filter(
    (job) => job.status === "OPEN",
  ).length;

  const closedJobsOnPage = jobs.filter(
    (job) => job.status === "CLOSED",
  ).length;

  const showingFrom =
    pagination.total === 0 ? 0 : (page - 1) * pagination.limit + 1;

  const showingTo = Math.min(
    page * pagination.limit,
    pagination.total,
  );

  return (
    <DashboardLayout title="Jobs" navItems={navItems}>
      <main className="min-h-full w-full overflow-hidden bg-[#f7f9fc] pb-8">
        <div className="mx-auto w-full max-w-[1500px] space-y-6 px-4 sm:px-6 lg:px-8">
          <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white px-5 py-6 shadow-[0_10px_40px_rgba(15,23,42,0.05)] sm:px-7">
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-50/70 blur-2xl" />
            <div className="absolute -bottom-28 left-1/3 h-52 w-52 rounded-full bg-violet-50/60 blur-3xl" />

            <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">
                  <BriefcaseBusiness size={14} />
                  Platform administration
                </div>

                <h1 className="text-3xl font-black tracking-tight text-[#172b4d] sm:text-4xl">
                  Job management
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  Monitor published jobs, review ownership details, and manage
                  platform availability from one workspace.
                </p>
              </div>

              <button
                type="button"
                onClick={handleRefresh}
                disabled={loading}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-extrabold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw
                  size={17}
                  className={loading ? "animate-spin" : ""}
                />
                Refresh
              </button>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              label="Total jobs"
              value={pagination.total}
              detail="Jobs matching current filters"
              icon={BriefcaseBusiness}
              iconClasses="bg-blue-50 text-blue-700"
            />

            <StatCard
              label="Open on page"
              value={openJobsOnPage}
              detail="Currently available on this page"
              icon={UserCheck}
              iconClasses="bg-emerald-50 text-emerald-700"
            />

            <StatCard
              label="Closed on page"
              value={closedJobsOnPage}
              detail="Currently closed on this page"
              icon={UserX}
              iconClasses="bg-red-50 text-red-700"
            />
          </section>

          <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:p-5">
            <div className="mb-4">
              <h2 className="text-sm font-black text-slate-900">
                Search & filters
              </h2>
              <p className="mt-1 text-xs font-medium text-slate-400">
                Find jobs by title, company, location, or publication status.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_220px]">
              <div className="relative">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={handleSearch}
                  placeholder="Search jobs, companies, or locations..."
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0066b3] focus:bg-white focus:ring-4 focus:ring-blue-50"
                />
              </div>

              <select
                value={status}
                onChange={handleStatusChange}
                className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-700 outline-none transition focus:border-[#0066b3] focus:bg-white focus:ring-4 focus:ring-blue-50"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_10px_40px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-sm font-black text-slate-900">
                  Published jobs
                </h2>
                <p className="mt-0.5 text-xs font-medium text-slate-400">
                  {pagination.total} total result
                  {pagination.total === 1 ? "" : "s"}
                </p>
              </div>

              <div className="hidden rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-bold text-slate-500 sm:block">
                Live data
              </div>
            </div>

            <div className="hidden overflow-x-auto md:block">
              {loading ? (
                <TableSkeleton />
              ) : (
                <table className="w-full min-w-[1050px]">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/70">
                      <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Job
                      </th>
                      <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Company
                      </th>
                      <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Recruiter
                      </th>
                      <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Salary
                      </th>
                      <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Status
                      </th>
                      <th className="px-6 py-4 text-right text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {jobs.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-20 text-center">
                          <div className="mx-auto flex max-w-sm flex-col items-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                              <BriefcaseBusiness size={24} />
                            </div>

                            <h3 className="mt-4 text-sm font-black text-slate-900">
                              No jobs found
                            </h3>

                            <p className="mt-1 text-xs font-medium text-slate-400">
                              Try changing your search or status filter.
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      jobs.map((job) => {
                        const company = job.company || null;
                        const recruiter =
                          job.createdBy || job.recruiter || null;

                        const currentActionLoading =
                          actionLoading === job._id;

                        return (
                          <tr
                            key={job._id}
                            className="group transition hover:bg-slate-50/70"
                          >
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#172b4d] text-xs font-black text-white shadow-sm">
                                  {getInitials(job.title)}
                                </div>

                                <div className="min-w-0">
                                  <p className="max-w-[240px] truncate text-sm font-black text-slate-900">
                                    {job.title || "Untitled Job"}
                                  </p>

                                  <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-400">
                                    <MapPin size={13} />
                                    <span className="max-w-[220px] truncate">
                                      {job.location || "Location not specified"}
                                    </span>
                                  </div>

                                  <div className="mt-1 flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                                    <CalendarDays size={12} />
                                    Posted {formatDate(job.createdAt)}
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-5">
                              <p className="max-w-[180px] truncate text-sm font-bold text-slate-800">
                                {company?.name || "—"}
                              </p>
                            </td>

                            <td className="px-6 py-5">
                              {recruiter ? (
                                <div className="flex items-center gap-2.5">
                                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[10px] font-black text-slate-600">
                                    {getInitials(recruiter.name)}
                                  </div>

                                  <div className="min-w-0">
                                    <p className="max-w-[170px] truncate text-sm font-bold text-slate-800">
                                      {recruiter.name || "—"}
                                    </p>

                                    <p className="max-w-[180px] truncate text-xs font-medium text-slate-400">
                                      {recruiter.email || "No email"}
                                    </p>
                                  </div>
                                </div>
                              ) : (
                                <span className="text-sm font-medium text-slate-400">
                                  —
                                </span>
                              )}
                            </td>

                            <td className="px-6 py-5">
                              <span className="text-sm font-bold text-slate-700">
                                {formatSalary(job)}
                              </span>
                            </td>

                            <td className="px-6 py-5">
                              <span
                                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-black ${getStatusClasses(
                                  job.status,
                                )}`}
                              >
                                <span
                                  className={`h-1.5 w-1.5 rounded-full ${
                                    job.status === "OPEN"
                                      ? "bg-emerald-500"
                                      : "bg-red-500"
                                  }`}
                                />

                                {job.status || "UNKNOWN"}
                              </span>
                            </td>

                            <td className="px-6 py-5 text-right">
                              <button
                                type="button"
                                disabled={currentActionLoading}
                                onClick={() => handleStatusUpdate(job)}
                                className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-black transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                  job.status === "OPEN"
                                    ? "bg-red-50 text-red-700 hover:bg-red-100"
                                    : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                }`}
                              >
                                {currentActionLoading ? (
                                  <Loader2
                                    size={15}
                                    className="animate-spin"
                                  />
                                ) : job.status === "OPEN" ? (
                                  <UserX size={15} />
                                ) : (
                                  <UserCheck size={15} />
                                )}

                                {job.status === "OPEN"
                                  ? "Close Job"
                                  : "Open Job"}
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              )}
            </div>

            <div className="divide-y divide-slate-100 md:hidden">
              {loading ? (
                <TableSkeleton />
              ) : jobs.length === 0 ? (
                <div className="px-6 py-20 text-center">
                  <BriefcaseBusiness
                    size={28}
                    className="mx-auto text-slate-300"
                  />
                  <p className="mt-3 text-sm font-black text-slate-900">
                    No jobs found
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-400">
                    Try changing your filters.
                  </p>
                </div>
              ) : (
                jobs.map((job) => {
                  const company = job.company || null;
                  const recruiter =
                    job.createdBy || job.recruiter || null;

                  const currentActionLoading =
                    actionLoading === job._id;

                  return (
                    <article
                      key={job._id}
                      className="space-y-4 p-4 transition hover:bg-slate-50/60"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#172b4d] text-xs font-black text-white shadow-sm">
                          {getInitials(job.title)}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-black text-slate-900">
                            {job.title || "Untitled Job"}
                          </p>

                          <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-400">
                            <MapPin size={13} />
                            <span className="truncate">
                              {job.location || "Location not specified"}
                            </span>
                          </div>

                          <p className="mt-1 text-[11px] font-medium text-slate-400">
                            Posted {formatDate(job.createdAt)}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-black ${getStatusClasses(
                            job.status,
                          )}`}
                        >
                          {job.status || "UNKNOWN"}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <div className="rounded-xl bg-slate-50 p-3">
                          <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                            Company
                          </p>

                          <p className="mt-1 truncate text-sm font-bold text-slate-800">
                            {company?.name || "—"}
                          </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-3">
                          <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                            Salary
                          </p>

                          <p className="mt-1 truncate text-sm font-bold text-slate-800">
                            {formatSalary(job)}
                          </p>
                        </div>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                          Recruiter
                        </p>

                        <p className="mt-1 truncate text-sm font-bold text-slate-800">
                          {recruiter?.name || "Not available"}
                        </p>

                        {recruiter?.email ? (
                          <p className="mt-0.5 truncate text-xs font-medium text-slate-400">
                            {recruiter.email}
                          </p>
                        ) : null}
                      </div>

                      <button
                        type="button"
                        disabled={currentActionLoading}
                        onClick={() => handleStatusUpdate(job)}
                        className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-black transition disabled:cursor-not-allowed disabled:opacity-50 ${
                          job.status === "OPEN"
                            ? "bg-red-50 text-red-700 hover:bg-red-100"
                            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        }`}
                      >
                        {currentActionLoading ? (
                          <Loader2 size={15} className="animate-spin" />
                        ) : job.status === "OPEN" ? (
                          <UserX size={15} />
                        ) : (
                          <UserCheck size={15} />
                        )}

                        {job.status === "OPEN" ? "Close Job" : "Open Job"}
                      </button>
                    </article>
                  );
                })
              )}
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/60 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="text-xs font-medium text-slate-500">
                Showing{" "}
                <span className="font-black text-slate-700">
                  {showingFrom}
                </span>{" "}
                to{" "}
                <span className="font-black text-slate-700">
                  {showingTo}
                </span>{" "}
                of{" "}
                <span className="font-black text-slate-700">
                  {pagination.total}
                </span>{" "}
                jobs
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={goToPreviousPage}
                  disabled={page <= 1 || loading}
                  className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-xs font-black text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={15} />
                  Previous
                </button>

                <span className="min-w-16 text-center text-xs font-black text-slate-600">
                  {page} / {pagination.pages}
                </span>

                <button
                  type="button"
                  onClick={goToNextPage}
                  disabled={page >= pagination.pages || loading}
                  className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-xs font-black text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </DashboardLayout>
  );
}
