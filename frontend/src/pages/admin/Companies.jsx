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
  Mail,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";

import DashboardLayout from "../../components/DashboardLayout";
import { getAdminApplications } from "../../services/adminService";

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
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
};

const formatStatus = (status) => {
  if (!status) return "—";

  return String(status)
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const getStatusClasses = (status) => {
  const normalizedStatus = String(status || "").toUpperCase();

  if (
    normalizedStatus === "HIRED" ||
    normalizedStatus === "SELECTED" ||
    normalizedStatus === "ACCEPTED"
  ) {
    return "border-emerald-100 bg-emerald-50 text-emerald-700";
  }

  if (
    normalizedStatus === "REJECTED" ||
    normalizedStatus === "DECLINED"
  ) {
    return "border-red-100 bg-red-50 text-red-700";
  }

  if (
    normalizedStatus === "SHORTLISTED" ||
    normalizedStatus === "INTERVIEW"
  ) {
    return "border-blue-100 bg-blue-50 text-blue-700";
  }

  return "border-amber-100 bg-amber-50 text-amber-700";
};

const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (!parts.length) return "US";

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
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

export default function Applications() {
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

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });

  const loadApplications = useCallback(async () => {
    try {
      setLoading(true);

      const params = {
        page,
        limit: 10,
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      const response = await getAdminApplications(params);
      const data = response?.data || {};

      const applicationList = Array.isArray(data.applications)
        ? data.applications
        : [];

      const backendPagination = data.pagination || {};

      setApplications(applicationList);

      setPagination({
        page: Number(backendPagination.page) || page,
        limit: Number(backendPagination.limit) || 10,
        total:
          Number(backendPagination.total) || applicationList.length,
        pages: Math.max(Number(backendPagination.pages) || 1, 1),
      });
    } catch (error) {
      console.error("Failed to load admin applications:", error);
      setApplications([]);

      toast.error(
        error?.response?.data?.message ||
          "Failed to load applications.",
      );
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setPage(1);
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
    loadApplications();
  };

  const showingFrom =
    pagination.total === 0 ? 0 : (page - 1) * pagination.limit + 1;

  const showingTo = Math.min(
    page * pagination.limit,
    pagination.total,
  );

  return (
    <DashboardLayout title="Applications" navItems={navItems}>
      <main className="min-h-full w-full overflow-hidden bg-[#f7f9fc] pb-8">
        <div className="mx-auto w-full max-w-[1500px] space-y-6 px-4 sm:px-6 lg:px-8">
          <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white px-5 py-6 shadow-[0_10px_40px_rgba(15,23,42,0.05)] sm:px-7">
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-50/70 blur-2xl" />
            <div className="absolute -bottom-28 left-1/3 h-52 w-52 rounded-full bg-violet-50/60 blur-3xl" />

            <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">
                  <FileCheck2 size={14} />
                  Platform administration
                </div>

                <h1 className="text-3xl font-black tracking-tight text-[#172b4d] sm:text-4xl">
                  Applications
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  Monitor applications submitted by job seekers across the
                  platform and review applicant, job, company, status, and
                  submission details.
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

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <StatCard
              label="Total applications"
              value={pagination.total}
              detail="Applications matching current search"
              icon={FileCheck2}
              iconClasses="bg-blue-50 text-blue-700"
            />

            <StatCard
              label="Current page"
              value={applications.length}
              detail="Applications currently loaded"
              icon={Activity}
              iconClasses="bg-violet-50 text-violet-700"
            />
          </section>

          <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:p-5">
            <div className="mb-4">
              <h2 className="text-sm font-black text-slate-900">
                Search applications
              </h2>
              <p className="mt-1 text-xs font-medium text-slate-400">
                Search by applicant or job details.
              </p>
            </div>

            <div className="relative">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Search applicant or job..."
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0066b3] focus:bg-white focus:ring-4 focus:ring-blue-50"
              />
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_10px_40px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-sm font-black text-slate-900">
                  Application records
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
                        Applicant
                      </th>
                      <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Job
                      </th>
                      <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Company
                      </th>
                      <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Applied
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {applications.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-20 text-center">
                          <div className="mx-auto flex max-w-sm flex-col items-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                              <FileCheck2 size={24} />
                            </div>

                            <h3 className="mt-4 text-sm font-black text-slate-900">
                              No applications found
                            </h3>

                            <p className="mt-1 text-xs font-medium text-slate-400">
                              Try changing your search.
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      applications.map((application) => {
                        const applicant =
                          application.applicant ||
                          application.user ||
                          null;

                        const job = application.job || null;

                        const company =
                          job?.company || application.company || null;

                        return (
                          <tr
                            key={application._id}
                            className="group transition hover:bg-slate-50/70"
                          >
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#172b4d] text-xs font-black text-white">
                                  {getInitials(applicant?.name)}
                                </div>

                                <div className="min-w-0">
                                  <p className="max-w-[210px] truncate text-sm font-black text-slate-900">
                                    {applicant?.name ||
                                      "Unknown Applicant"}
                                  </p>

                                  {applicant?.email ? (
                                    <div className="mt-1 flex max-w-[220px] items-center gap-1.5 text-xs font-medium text-slate-400">
                                      <Mail size={12} />
                                      <span className="truncate">
                                        {applicant.email}
                                      </span>
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-5">
                              <div className="flex items-center gap-2">
                                <BriefcaseBusiness
                                  size={15}
                                  className="shrink-0 text-slate-400"
                                />

                                <p className="max-w-[240px] truncate text-sm font-bold text-slate-800">
                                  {job?.title || "Unknown Job"}
                                </p>
                              </div>
                            </td>

                            <td className="px-6 py-5">
                              <p className="max-w-[180px] truncate text-sm font-bold text-slate-800">
                                {company?.name || "—"}
                              </p>
                            </td>

                            <td className="px-6 py-5">
                              <span
                                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-black ${getStatusClasses(
                                  application.status,
                                )}`}
                              >
                                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                {formatStatus(application.status)}
                              </span>
                            </td>

                            <td className="px-6 py-5">
                              <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                                <CalendarDays
                                  size={14}
                                  className="text-slate-400"
                                />
                                {formatDate(
                                  application.createdAt ||
                                    application.appliedAt,
                                )}
                              </div>
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
              ) : applications.length === 0 ? (
                <div className="px-6 py-20 text-center">
                  <FileCheck2
                    size={28}
                    className="mx-auto text-slate-300"
                  />
                  <p className="mt-3 text-sm font-black text-slate-900">
                    No applications found
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-400">
                    Try changing your search.
                  </p>
                </div>
              ) : (
                applications.map((application) => {
                  const applicant =
                    application.applicant ||
                    application.user ||
                    null;

                  const job = application.job || null;

                  const company =
                    job?.company || application.company || null;

                  return (
                    <article
                      key={application._id}
                      className="space-y-4 p-4 transition hover:bg-slate-50/60"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#172b4d] text-xs font-black text-white">
                          {getInitials(applicant?.name)}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-black text-slate-900">
                            {applicant?.name || "Unknown Applicant"}
                          </p>

                          {applicant?.email ? (
                            <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-400">
                              <Mail size={12} />
                              <span className="truncate">
                                {applicant.email}
                              </span>
                            </div>
                          ) : null}
                        </div>

                        <span
                          className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-black ${getStatusClasses(
                            application.status,
                          )}`}
                        >
                          {formatStatus(application.status)}
                        </span>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                          Job
                        </p>

                        <div className="mt-1 flex items-center gap-2">
                          <BriefcaseBusiness
                            size={14}
                            className="shrink-0 text-slate-400"
                          />

                          <p className="truncate text-sm font-bold text-slate-800">
                            {job?.title || "Unknown Job"}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <div className="rounded-xl bg-slate-50 p-3">
                          <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                            Company
                          </p>

                          <p className="mt-1 truncate text-sm font-bold text-slate-800">
                            {company?.name || "—"}
                          </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-3">
                          <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                            Applied
                          </p>

                          <p className="mt-1 flex items-center gap-1.5 text-sm font-bold text-slate-800">
                            <CalendarDays
                              size={14}
                              className="text-slate-400"
                            />
                            {formatDate(
                              application.createdAt ||
                                application.appliedAt,
                            )}
                          </p>
                        </div>
                      </div>
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
                applications
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
