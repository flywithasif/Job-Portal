import { useEffect, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import { getJobs } from "../services/jobService";
import JobCard from "../components/JobCard";
import JobFilters from "../components/JobFilters";

export default function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    location: searchParams.get("location") || "",
    type: searchParams.get("employmentType") || "",
    workMode: searchParams.get("workplaceType") || "",
  });

  const [sort, setSort] = useState("newest");

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });

  /*
   * Fetch jobs from backend.
   */
  useEffect(() => {
    let isMounted = true;

    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError("");

        const params = {
          page: pagination.page,
          limit: pagination.limit,
        };

        if (filters.search.trim()) {
          params.search = filters.search.trim();
        }

        if (filters.location.trim()) {
          params.location = filters.location.trim();
        }

        if (filters.type) {
          params.employmentType = filters.type;
        }

        if (filters.workMode) {
          params.workplaceType = filters.workMode;
        }

        const response = await getJobs(params);

        if (!isMounted) {
          return;
        }

        setJobs(response?.data || []);

        setPagination((previous) => ({
          ...previous,
          page: response?.pagination?.page || previous.page,
          limit: response?.pagination?.limit || previous.limit,
          total: response?.pagination?.total || 0,
          pages: response?.pagination?.pages || 1,
        }));
      } catch (err) {
        if (!isMounted) {
          return;
        }

        const message =
          err?.response?.data?.message ||
          "Unable to load jobs. Please try again.";

        setError(message);
        setJobs([]);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchJobs();

    return () => {
      isMounted = false;
    };
  }, [
    filters.search,
    filters.location,
    filters.type,
    filters.workMode,
    pagination.page,
    pagination.limit,
  ]);

  /*
   * Reset pagination whenever filters change.
   */
  useEffect(() => {
    setPagination((previous) => {
      if (previous.page === 1) {
        return previous;
      }

      return {
        ...previous,
        page: 1,
      };
    });
  }, [
    filters.search,
    filters.location,
    filters.type,
    filters.workMode,
  ]);

  /*
   * Keep URL query parameters synchronized with filters.
   */
  useEffect(() => {
    const params = {};

    if (filters.search.trim()) {
      params.search = filters.search.trim();
    }

    if (filters.location.trim()) {
      params.location = filters.location.trim();
    }

    if (filters.type) {
      params.employmentType = filters.type;
    }

    if (filters.workMode) {
      params.workplaceType = filters.workMode;
    }

    setSearchParams(params, {
      replace: true,
    });
  }, [
    filters.search,
    filters.location,
    filters.type,
    filters.workMode,
    setSearchParams,
  ]);

  /*
   * Sort the jobs returned by the backend.
   */
  const sortedJobs = [...jobs].sort((firstJob, secondJob) => {
    if (sort === "salary") {
      const firstSalary = Number(firstJob.salaryMax || 0);
      const secondSalary = Number(secondJob.salaryMax || 0);

      return secondSalary - firstSalary;
    }

    return (
      new Date(secondJob.createdAt || 0).getTime() -
      new Date(firstJob.createdAt || 0).getTime()
    );
  });

  /*
   * Handle pagination.
   */
  const goToPage = (page) => {
    if (
      page < 1 ||
      page > pagination.pages ||
      page === pagination.page
    ) {
      return;
    }

    setPagination((previous) => ({
      ...previous,
      page,
    }));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /*
   * Retry failed API request.
   */
  const handleRetry = () => {
    setError("");

    setPagination((previous) => ({
      ...previous,
      page: 1,
    }));

    toast.loading("Refreshing jobs...", {
      id: "jobs-refresh",
    });

    setTimeout(() => {
      toast.dismiss("jobs-refresh");
    }, 800);
  };

  return (
    <main className="min-h-screen bg-[#f6f8fb]">
      {/* =========================================================
          PAGE HEADER
          ========================================================= */}

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#0066b3]">
            Opportunities
          </p>

          <h1 className="mt-2 text-3xl font-black text-[#172b4d]">
            Find your next job
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Search thousands of opportunities from growing companies.
          </p>
        </div>
      </section>

      {/* =========================================================
          JOB CONTENT
          ========================================================= */}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          {/* Filters */}

          <JobFilters
            filters={filters}
            setFilters={setFilters}
          />

          {/* Jobs */}

          <section>
            {/* Top controls */}

            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-bold text-[#172b4d]">
                  {loading
                    ? "Loading jobs..."
                    : `${pagination.total} jobs found`}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Updated recently
                </p>
              </div>

              <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3">
                <span className="text-xs font-bold text-slate-400">
                  Sort
                </span>

                <ChevronDown size={15} />

                <select
                  value={sort}
                  onChange={(event) =>
                    setSort(event.target.value)
                  }
                  className="h-10 bg-transparent text-sm font-semibold outline-none"
                >
                  <option value="newest">Newest</option>
                  <option value="salary">Salary</option>
                </select>
              </label>
            </div>

            {/* =====================================================
                LOADING STATE
                ===================================================== */}

            {loading ? (
              <div className="grid gap-4">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6"
                  >
                    <div className="h-5 w-2/3 rounded bg-slate-200" />

                    <div className="mt-4 h-4 w-1/3 rounded bg-slate-200" />

                    <div className="mt-6 h-4 w-full rounded bg-slate-100" />

                    <div className="mt-2 h-4 w-4/5 rounded bg-slate-100" />

                    <div className="mt-6 flex gap-2">
                      <div className="h-7 w-20 rounded bg-slate-100" />

                      <div className="h-7 w-24 rounded bg-slate-100" />

                      <div className="h-7 w-20 rounded bg-slate-100" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              /* ===================================================
                  ERROR STATE
                  =================================================== */

              <div className="rounded-2xl border border-red-200 bg-white p-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                  <Search
                    className="text-red-400"
                    size={24}
                  />
                </div>

                <h2 className="mt-4 font-extrabold text-[#172b4d]">
                  Unable to load jobs
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={handleRetry}
                  className="mt-6 rounded-xl bg-[#172b4d] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#0066b3]"
                >
                  Try again
                </button>
              </div>
            ) : sortedJobs.length > 0 ? (
              /* ===================================================
                  JOB LIST
                  =================================================== */

              <>
                <div className="grid gap-4">
                  {sortedJobs.map((job) => (
                    <JobCard
                      key={job._id || job.id}
                      job={job}
                    />
                  ))}
                </div>

                {/* =================================================
                    PAGINATION
                    ================================================= */}

                {pagination.pages > 1 && (
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                    <button
                      type="button"
                      disabled={pagination.page === 1}
                      onClick={() =>
                        goToPage(pagination.page - 1)
                      }
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-[#0066b3] hover:text-[#0066b3] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Previous
                    </button>

                    {Array.from(
                      { length: pagination.pages },
                      (_, index) => index + 1,
                    ).map((page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => goToPage(page)}
                        className={`h-9 min-w-9 rounded-xl px-3 text-sm font-bold transition ${
                          pagination.page === page
                            ? "bg-[#172b4d] text-white"
                            : "border border-slate-200 bg-white text-slate-600 hover:border-[#0066b3] hover:text-[#0066b3]"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      type="button"
                      disabled={
                        pagination.page === pagination.pages
                      }
                      onClick={() =>
                        goToPage(pagination.page + 1)
                      }
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-[#0066b3] hover:text-[#0066b3] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* ===================================================
                  EMPTY STATE
                  =================================================== */

              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
                <Search
                  className="mx-auto text-slate-300"
                  size={38}
                />

                <h2 className="mt-4 font-extrabold text-[#172b4d]">
                  No jobs found
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Try changing your search or filters.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}