import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowUpRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ExternalLink,
  MapPin,
  RefreshCw,
  Search,
  Video,
  XCircle,
} from "lucide-react";

import { getMyInterviews } from "../../services/interviewService";

// ============================================
// FILTERS
// ============================================

const filters = [
  "All",
  "Upcoming",
  "Completed",
  "Cancelled",
];

// ============================================
// STATUS STYLES
// ============================================

const statusStyles = {
  Upcoming:
    "bg-blue-50 text-blue-700 ring-blue-200",

  Completed:
    "bg-emerald-50 text-emerald-700 ring-emerald-200",

  Cancelled:
    "bg-red-50 text-red-700 ring-red-200",
};

// ============================================
// HELPERS
// ============================================

function formatDate(dateString) {
  if (!dateString) {
    return "Date not available";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Date not available";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(dateString) {
  if (!dateString) {
    return "Time not available";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Time not available";
  }

  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDuration(minutes) {
  const duration = Number(minutes);

  if (!Number.isFinite(duration)) {
    return "30 minutes";
  }

  return `${duration} ${
    duration === 1 ? "minute" : "minutes"
  }`;
}

function getDisplayStatus(status) {
  switch (status) {
    case "SCHEDULED":
      return "Upcoming";

    case "COMPLETED":
      return "Completed";

    case "CANCELLED":
      return "Cancelled";

    default:
      return "Upcoming";
  }
}

function getDisplayType(type) {
  switch (type) {
    case "VIDEO":
      return "Video Interview";

    case "PHONE":
      return "Phone Interview";

    case "IN_PERSON":
      return "In-person";

    default:
      return "Interview";
  }
}

function getCompanyName(interview) {
  return (
    interview?.job?.companyName ||
    interview?.job?.company?.name ||
    "Company"
  );
}

function getJobTitle(interview) {
  return (
    interview?.job?.title ||
    interview?.title ||
    "Interview"
  );
}

function getLocation(interview) {
  if (interview?.type === "VIDEO") {
    return "Remote";
  }

  if (interview?.location) {
    return interview.location;
  }

  if (interview?.job?.location) {
    if (
      typeof interview.job.location ===
      "string"
    ) {
      return interview.job.location;
    }

    if (interview.job.location.city) {
      return interview.job.location.city;
    }
  }

  return interview?.type === "PHONE"
    ? "Phone"
    : "Location not available";
}

// ============================================
// INTERVIEW CARD
// ============================================

function InterviewCard({ interview }) {
  const displayStatus = getDisplayStatus(
    interview.status
  );

  const displayType = getDisplayType(
    interview.type
  );

  const isUpcoming =
    interview.status === "SCHEDULED";

  const isCompleted =
    interview.status === "COMPLETED";

  const isVideo =
    interview.type === "VIDEO";

  const interviewer =
    interview.interviewerName ||
    interview.recruiter?.name ||
    "Recruiter";

  const company = getCompanyName(interview);

  const role = getJobTitle(interview);

  const location = getLocation(interview);

  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-5 transition duration-200 hover:border-blue-200 hover:shadow-lg hover:shadow-slate-200/50 sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <Building2 size={23} />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 sm:text-lg">
                {role}
              </h3>

              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${
                  statusStyles[displayStatus]
                }`}
              >
                {displayStatus}
              </span>
            </div>

            <p className="mt-1 font-medium text-slate-600">
              {company}
            </p>

            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays size={15} />

                {formatDate(
                  interview.scheduledAt
                )}
              </span>

              <span className="inline-flex items-center gap-1.5">
                <Clock3 size={15} />

                {formatTime(
                  interview.scheduledAt
                )}
              </span>
            </div>
          </div>
        </div>

        <span className="inline-flex w-fit items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">
          {isVideo ||
          interview.type === "PHONE" ? (
            <Video size={15} />
          ) : (
            <MapPin size={15} />
          )}

          {displayType}
        </span>
      </div>

      <div className="mt-5 grid gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-2">
        <div>
          <p className="text-xs font-medium text-slate-500">
            Interviewer
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-800">
            {interviewer}
          </p>

          {interview.interviewerEmail && (
            <p className="mt-1 break-all text-xs text-slate-500">
              {interview.interviewerEmail}
            </p>
          )}
        </div>

        <div>
          <p className="text-xs font-medium text-slate-500">
            Duration
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-800">
            {formatDuration(
              interview.duration
            )}
          </p>
        </div>

        <div className="sm:col-span-2">
          <p className="text-xs font-medium text-slate-500">
            Location
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-800">
            {location}
          </p>
        </div>
      </div>

      {interview.notes && (
        <p className="mt-4 text-sm leading-6 text-slate-600">
          {interview.notes}
        </p>
      )}

      {interview.cancellationReason &&
        interview.status === "CANCELLED" && (
          <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
            <p className="text-xs font-semibold text-red-700">
              Cancellation reason
            </p>

            <p className="mt-1 text-sm leading-6 text-red-700">
              {interview.cancellationReason}
            </p>
          </div>
        )}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <Link
          to="/dashboard/applied-jobs"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 transition hover:text-blue-700"
        >
          View applications

          <ArrowUpRight size={15} />
        </Link>

        {isUpcoming &&
        interview.meetingLink ? (
          <a
            href={interview.meetingLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Join interview

            <ExternalLink size={15} />
          </a>
        ) : isUpcoming ? (
          <span className="rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-medium text-slate-500">
            Meeting link not available
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500">
            {isCompleted ? (
              <CheckCircle2
                size={16}
                className="text-emerald-600"
              />
            ) : (
              <XCircle
                size={16}
                className="text-red-500"
              />
            )}

            {isCompleted
              ? "Interview completed"
              : "Interview cancelled"}
          </span>
        )}
      </div>
    </article>
  );
}

// ============================================
// PAGE
// ============================================

export default function Interviews() {
  const [interviews, setInterviews] = useState(
    []
  );

  const [activeFilter, setActiveFilter] =
    useState("All");

  const [searchQuery, setSearchQuery] =
    useState("");

  const [loading, setLoading] = useState(
    true
  );

  const [error, setError] = useState("");

  // ==========================================
  // LOAD INTERVIEWS
  // ==========================================

  const loadInterviews = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getMyInterviews({
          page: 1,
          limit: 50,
        });

      const data = Array.isArray(
        response?.data
      )
        ? response.data
        : [];

      setInterviews(data);
    } catch (err) {
      console.error(
        "Failed to load interviews:",
        err
      );

      const message =
        err?.response?.data?.message ||
        "Unable to load interviews.";

      setError(message);

      setInterviews([]);

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInterviews();
  }, []);

  // ==========================================
  // STATS
  // ==========================================

  const stats = useMemo(() => {
    return {
      total: interviews.length,

      upcoming: interviews.filter(
        (interview) =>
          interview.status ===
          "SCHEDULED"
      ).length,

      completed: interviews.filter(
        (interview) =>
          interview.status ===
          "COMPLETED"
      ).length,

      cancelled: interviews.filter(
        (interview) =>
          interview.status ===
          "CANCELLED"
      ).length,
    };
  }, [interviews]);

  // ==========================================
  // FILTER + SEARCH
  // ==========================================

  const filteredInterviews = useMemo(() => {
    const query = searchQuery
      .trim()
      .toLowerCase();

    return [...interviews]
      .filter((interview) => {
        if (activeFilter === "All") {
          return true;
        }

        return (
          getDisplayStatus(
            interview.status
          ) === activeFilter
        );
      })
      .filter((interview) => {
        if (!query) {
          return true;
        }

        const values = [
          getJobTitle(interview),
          getCompanyName(interview),
          getLocation(interview),
          interview.interviewerName,
          interview.recruiter?.name,
          interview.interviewerEmail,
          interview.notes,
        ];

        return values.some(
          (value) =>
            String(value || "")
              .toLowerCase()
              .includes(query)
        );
      })
      .sort((a, b) => {
        if (
          a.status === "SCHEDULED" &&
          b.status !== "SCHEDULED"
        ) {
          return -1;
        }

        if (
          a.status !== "SCHEDULED" &&
          b.status === "SCHEDULED"
        ) {
          return 1;
        }

        return (
          new Date(a.scheduledAt) -
          new Date(b.scheduledAt)
        );
      });
  }, [
    interviews,
    activeFilter,
    searchQuery,
  ]);

  // ==========================================
  // STAT CARDS
  // ==========================================

  const statCards = [
    {
      label: "Total interviews",
      value: stats.total,
      icon: CalendarDays,
      color:
        "bg-slate-100 text-slate-700",
    },

    {
      label: "Upcoming",
      value: stats.upcoming,
      icon: Clock3,
      color:
        "bg-blue-50 text-blue-700",
    },

    {
      label: "Completed",
      value: stats.completed,
      icon: CheckCircle2,
      color:
        "bg-emerald-50 text-emerald-700",
    },

    {
      label: "Cancelled",
      value: stats.cancelled,
      icon: XCircle,
      color:
        "bg-red-50 text-red-600",
    },
  ];

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-7 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Page heading */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-700">
              CAREER MANAGEMENT
            </p>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              My Interviews
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              Manage your interview schedule
              and prepare for your next
              opportunity.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={loadInterviews}
              disabled={loading}
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={16}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh
            </button>

            <Link
              to="/dashboard/applied-jobs"
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700"
            >
              View applications

              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>

        {/* Statistics */}

        <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-medium text-slate-500 sm:text-sm">
                    {stat.label}
                  </p>

                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${stat.color}`}
                  >
                    <Icon size={18} />
                  </span>
                </div>

                <p className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* Interview list */}

        <section className="mt-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Interview schedule
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {filteredInterviews.length}{" "}
                interview
                {filteredInterviews.length !==
                1
                  ? "s"
                  : ""}{" "}
                found
              </p>
            </div>

            <div className="relative w-full lg:max-w-xs">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(
                    event.target.value
                  )
                }
                placeholder="Search role or company..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
              />
            </div>
          </div>

          {/* Status filters */}

          <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
            {filters.map((filter) => {
              const count =
                filter === "All"
                  ? stats.total
                  : filter === "Upcoming"
                    ? stats.upcoming
                    : filter === "Completed"
                      ? stats.completed
                      : stats.cancelled;

              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() =>
                    setActiveFilter(
                      filter
                    )
                  }
                  className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    activeFilter === filter
                      ? "bg-blue-600 text-white shadow-sm"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-700"
                  }`}
                >
                  {filter}

                  <span
                    className={`rounded-md px-1.5 py-0.5 text-xs ${
                      activeFilter === filter
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Loading */}

          {loading ? (
            <div className="mt-4 space-y-4">
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
                >
                  <div className="flex gap-4">
                    <div className="h-12 w-12 rounded-xl bg-slate-100" />

                    <div className="flex-1">
                      <div className="h-5 w-2/3 rounded bg-slate-100" />

                      <div className="mt-3 h-4 w-1/3 rounded bg-slate-100" />

                      <div className="mt-4 h-4 w-1/2 rounded bg-slate-100" />
                    </div>
                  </div>

                  <div className="mt-5 h-24 rounded-xl bg-slate-50" />
                </div>
              ))}
            </div>
          ) : error ? (
            /* Error */

            <div className="mt-4 rounded-2xl border border-red-100 bg-white px-5 py-14 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <XCircle size={23} />
              </div>

              <h3 className="mt-4 font-bold text-slate-900">
                Unable to load interviews
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                {error}
              </p>

              <button
                type="button"
                onClick={loadInterviews}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <RefreshCw size={15} />
                Try again
              </button>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {filteredInterviews.length >
              0 ? (
                filteredInterviews.map(
                  (interview) => (
                    <InterviewCard
                      key={interview._id}
                      interview={interview}
                    />
                  )
                )
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                    <CalendarDays size={23} />
                  </div>

                  <h3 className="mt-4 font-bold text-slate-900">
                    No interviews found
                  </h3>

                  <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                    {interviews.length ===
                    0
                      ? "You do not have any interviews scheduled yet."
                      : "Try another filter or search for a different role or company."}
                  </p>

                  {(activeFilter !==
                    "All" ||
                    searchQuery) && (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveFilter(
                          "All"
                        );

                        setSearchQuery("");
                      }}
                      className="mt-4 text-sm font-semibold text-blue-700 hover:text-blue-800"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}