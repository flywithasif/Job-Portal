import { useCallback, useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  Mail,
  RefreshCw,
  Search,
  UserRound,
} from "lucide-react";
import toast from "react-hot-toast";

import { getAdminApplications } from "../../services/adminService";

// ============================================
// HELPERS
// ============================================

const formatDate = (date) => {
  if (!date) {
    return "—";
  }

  try {
    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      },
    );
  } catch {
    return "—";
  }
};

const formatStatus = (status) => {
  if (!status) {
    return "—";
  }

  return status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
};

const getStatusClasses = (status) => {
  const normalizedStatus =
    String(status || "").toUpperCase();

  if (
    normalizedStatus === "HIRED" ||
    normalizedStatus === "SELECTED" ||
    normalizedStatus === "ACCEPTED"
  ) {
    return "bg-emerald-50 text-emerald-700";
  }

  if (
    normalizedStatus === "REJECTED" ||
    normalizedStatus === "DECLINED"
  ) {
    return "bg-red-50 text-red-700";
  }

  if (
    normalizedStatus === "SHORTLISTED" ||
    normalizedStatus === "INTERVIEW"
  ) {
    return "bg-blue-50 text-blue-700";
  }

  return "bg-amber-50 text-amber-700";
};

const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    return (
      parts[0]?.slice(0, 2).toUpperCase() ||
      "US"
    );
  }

  return `${parts[0]?.[0] || ""}${
    parts[1]?.[0] || ""
  }`.toUpperCase();
};

// ============================================
// COMPONENT
// ============================================

export default function Applications() {
  // ==========================================
  // STATE
  // ==========================================

  const [applications, setApplications] =
    useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });

  // ==========================================
  // LOAD APPLICATIONS
  // ==========================================

  const loadApplications = useCallback(
    async (requestedPage = page) => {
      try {
        setLoading(true);

        const params = {
          page: requestedPage,
          limit: 10,
        };

        if (search.trim()) {
          params.search = search.trim();
        }

        const response =
          await getAdminApplications(params);

        const data =
          response?.data || {};

        const applicationList =
          Array.isArray(
            data.applications,
          )
            ? data.applications
            : [];

        setApplications(
          applicationList,
        );

        const backendPagination =
          data.pagination || {};

        setPagination({
          page:
            Number(
              backendPagination.page,
            ) || requestedPage,

          limit:
            Number(
              backendPagination.limit,
            ) || 10,

          total:
            Number(
              backendPagination.total,
            ) || applicationList.length,

          pages:
            Number(
              backendPagination.pages,
            ) || 1,
        });
      } catch (error) {
        console.error(
          "Failed to load admin applications:",
          error,
        );

        setApplications([]);

        toast.error(
          error?.response?.data?.message ||
            "Failed to load applications.",
        );
      } finally {
        setLoading(false);
      }
    },
    [page, search],
  );

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    loadApplications(page);
  }, [loadApplications, page]);

  // ==========================================
  // SEARCH
  // ==========================================

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  // ==========================================
  // PAGINATION
  // ==========================================

  const goToPreviousPage = () => {
    if (page <= 1) {
      return;
    }

    setPage((currentPage) =>
      currentPage - 1,
    );
  };

  const goToNextPage = () => {
    if (page >= pagination.pages) {
      return;
    }

    setPage((currentPage) =>
      currentPage + 1,
    );
  };

  // ==========================================
  // REFRESH
  // ==========================================

  const handleRefresh = () => {
    loadApplications(page);
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* ======================================
            PAGE HEADER
        ====================================== */}

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-500">
              <BriefcaseBusiness size={16} />

              <span>Administration</span>

              <span>/</span>

              <span className="text-slate-900">
                Applications
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Applications
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Monitor applications submitted by
              job seekers across the platform.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={17}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>
        </div>

        {/* ======================================
            SUMMARY
        ====================================== */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Applications
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-950">
              {pagination.total}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Current Page
            </p>

            <p className="mt-2 text-2xl font-bold text-slate-950">
              {applications.length}
            </p>
          </div>
        </div>

        {/* ======================================
            SEARCH
        ====================================== */}

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
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
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100"
            />
          </div>
        </div>

        {/* ======================================
            APPLICATION TABLE
        ====================================== */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Desktop */}

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Applicant
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Job
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Company
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Applied
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  Array.from({
                    length: 6,
                  }).map((_, index) => (
                    <tr key={index}>
                      <td
                        colSpan={5}
                        className="px-6 py-5"
                      >
                        <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
                      </td>
                    </tr>
                  ))
                ) : applications.length ===
                  0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-16 text-center"
                    >
                      <div className="mx-auto flex max-w-sm flex-col items-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                          <BriefcaseBusiness
                            size={24}
                          />
                        </div>

                        <h3 className="mt-4 text-sm font-bold text-slate-900">
                          No applications found
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          Try changing your
                          search.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  applications.map(
                    (application) => {
                      const applicant =
                        application.applicant ||
                        application.user ||
                        null;

                      const job =
                        application.job ||
                        null;

                      const company =
                        job?.company ||
                        application.company ||
                        null;

                      return (
                        <tr
                          key={
                            application._id
                          }
                          className="transition hover:bg-slate-50/70"
                        >
                          {/* Applicant */}

                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-xs font-bold text-white">
                                {getInitials(
                                  applicant?.name,
                                )}
                              </div>

                              <div className="min-w-0">
                                <p className="truncate text-sm font-bold text-slate-900">
                                  {applicant?.name ||
                                    "Unknown Applicant"}
                                </p>

                                {applicant?.email ? (
                                  <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                                    <Mail
                                      size={12}
                                    />

                                    <span className="truncate">
                                      {
                                        applicant.email
                                      }
                                    </span>
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          </td>

                          {/* Job */}

                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2">
                              <BriefcaseBusiness
                                size={15}
                                className="shrink-0 text-slate-400"
                              />

                              <p className="max-w-[220px] truncate text-sm font-semibold text-slate-800">
                                {job?.title ||
                                  "Unknown Job"}
                              </p>
                            </div>
                          </td>

                          {/* Company */}

                          <td className="px-6 py-5">
                            <p className="text-sm font-semibold text-slate-800">
                              {company?.name ||
                                "—"}
                            </p>
                          </td>

                          {/* Status */}

                          <td className="px-6 py-5">
                            <span
                              className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${getStatusClasses(
                                application.status,
                              )}`}
                            >
                              {formatStatus(
                                application.status,
                              )}
                            </span>
                          </td>

                          {/* Applied */}

                          <td className="px-6 py-5">
                            <span className="text-sm text-slate-600">
                              {formatDate(
                                application.createdAt ||
                                  application.appliedAt,
                              )}
                            </span>
                          </td>
                        </tr>
                      );
                    },
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* ====================================
              MOBILE
          ==================================== */}

          <div className="divide-y divide-slate-100 md:hidden">
            {loading ? (
              Array.from({
                length: 5,
              }).map((_, index) => (
                <div
                  key={index}
                  className="p-4"
                >
                  <div className="h-40 animate-pulse rounded-xl bg-slate-100" />
                </div>
              ))
            ) : applications.length ===
              0 ? (
              <div className="px-6 py-16 text-center">
                <BriefcaseBusiness
                  size={26}
                  className="mx-auto text-slate-300"
                />

                <p className="mt-3 text-sm font-bold text-slate-900">
                  No applications found
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Try changing your search.
                </p>
              </div>
            ) : (
              applications.map(
                (application) => {
                  const applicant =
                    application.applicant ||
                    application.user ||
                    null;

                  const job =
                    application.job ||
                    null;

                  const company =
                    job?.company ||
                    application.company ||
                    null;

                  return (
                    <div
                      key={
                        application._id
                      }
                      className="space-y-4 p-4"
                    >
                      {/* Applicant */}

                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-xs font-bold text-white">
                          {getInitials(
                            applicant?.name,
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-slate-900">
                            {applicant?.name ||
                              "Unknown Applicant"}
                          </p>

                          {applicant?.email ? (
                            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                              <Mail
                                size={12}
                              />

                              <span className="truncate">
                                {
                                  applicant.email
                                }
                              </span>
                            </div>
                          ) : null}
                        </div>

                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${getStatusClasses(
                            application.status,
                          )}`}
                        >
                          {formatStatus(
                            application.status,
                          )}
                        </span>
                      </div>

                      {/* Job */}

                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          Job
                        </p>

                        <div className="mt-1 flex items-center gap-2">
                          <BriefcaseBusiness
                            size={14}
                            className="shrink-0 text-slate-400"
                          />

                          <p className="truncate text-sm font-semibold text-slate-800">
                            {job?.title ||
                              "Unknown Job"}
                          </p>
                        </div>
                      </div>

                      {/* Company */}

                      <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                        <span className="text-xs text-slate-400">
                          Company
                        </span>

                        <span className="text-xs font-semibold text-slate-700">
                          {company?.name ||
                            "—"}
                        </span>
                      </div>

                      {/* Date */}

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">
                          Applied
                        </span>

                        <span className="text-xs font-semibold text-slate-700">
                          {formatDate(
                            application.createdAt ||
                              application.appliedAt,
                          )}
                        </span>
                      </div>
                    </div>
                  );
                },
              )
            )}
          </div>

          {/* ====================================
              PAGINATION
          ==================================== */}

          <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50/50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-xs font-medium text-slate-500">
              Showing{" "}
              <span className="font-bold text-slate-700">
                {applications.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-slate-700">
                {pagination.total}
              </span>{" "}
              applications
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={
                  goToPreviousPage
                }
                disabled={
                  page <= 1 || loading
                }
                className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={15} />

                Previous
              </button>

              <span className="min-w-16 text-center text-xs font-bold text-slate-600">
                {page} /{" "}
                {pagination.pages}
              </span>

              <button
                type="button"
                onClick={goToNextPage}
                disabled={
                  page >=
                    pagination.pages ||
                  loading
                }
                className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next

                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}