import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  MapPin,
  Search,
  XCircle,
} from "lucide-react";

import { getMyApplications } from "../../services/applicationService";

const statusConfig = {
  PENDING: {
    label: "Applied",
    className: "bg-blue-50 text-blue-700 border-blue-100",
    icon: FileText,
  },
  REVIEWING: {
    label: "Under Review",
    className: "bg-amber-50 text-amber-700 border-amber-100",
    icon: Clock3,
  },
  SHORTLISTED: {
    label: "Shortlisted",
    className: "bg-violet-50 text-violet-700 border-violet-100",
    icon: CheckCircle2,
  },
  ACCEPTED: {
    label: "Accepted",
    className: "bg-emerald-50 text-emerald-700 border-emerald-100",
    icon: CheckCircle2,
  },
  REJECTED: {
    label: "Rejected",
    className: "bg-red-50 text-red-700 border-red-100",
    icon: XCircle,
  },
};

const filters = [
  { value: "ALL", label: "All" },
  { value: "PENDING", label: "Applied" },
  { value: "REVIEWING", label: "Under Review" },
  { value: "SHORTLISTED", label: "Shortlisted" },
  { value: "ACCEPTED", label: "Accepted" },
  { value: "REJECTED", label: "Rejected" },
];

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatSalary = (min, max) => {
  if (min == null && max == null) return "Salary not disclosed";

  const formatAmount = (amount) => {
    if (amount == null) return "";

    const number = Number(amount);

    if (Number.isNaN(number)) return "";

    if (number >= 10000000) {
      return `₹${(number / 10000000).toFixed(1)}Cr`;
    }

    if (number >= 100000) {
      return `₹${(number / 100000).toFixed(1)}L`;
    }

    if (number >= 1000) {
      return `₹${Math.round(number / 1000)}K`;
    }

    return `₹${number.toLocaleString("en-IN")}`;
  };

  if (min != null && max != null) {
    return `${formatAmount(min)} - ${formatAmount(max)}`;
  }

  return formatAmount(min ?? max);
};

const getCompanyName = (application) => {
  return (
    application?.job?.companyName ||
    application?.job?.company?.name ||
    application?.company?.name ||
    application?.companyName ||
    "Company"
  );
};

const getJobTitle = (application) => {
  return (
    application?.job?.title ||
    application?.title ||
    "Job application"
  );
};

const normalizeApplication = (application) => {
  const job = application?.job || {};

  const salaryMin =
    job.salaryMin ??
    application?.salaryMin ??
    application?.salary?.min ??
    null;

  const salaryMax =
    job.salaryMax ??
    application?.salaryMax ??
    application?.salary?.max ??
    null;

  const status = String(application?.status || "PENDING").toUpperCase();

  return {
    id: application?._id || application?.id,
    jobId:
      typeof application?.job === "string"
        ? application.job
        : application?.job?._id || application?.job?.id,
    title: getJobTitle(application),
    company: getCompanyName(application),
    location:
      job.location ||
      application?.location ||
      "Location not specified",
    appliedDate:
      application?.createdAt ||
      application?.appliedAt ||
      application?.applicationDate,
    status,
    type:
      job.employmentType ||
      application?.employmentType ||
      "Not specified",
    workplaceType: job.workplaceType || "",
    salary: formatSalary(salaryMin, salaryMax),
    nextStep: getNextStep(status),
  };
};

function getNextStep(status) {
  switch (status) {
    case "PENDING":
      return "Application submitted successfully";

    case "REVIEWING":
      return "Recruiter is reviewing your application";

    case "SHORTLISTED":
      return "Recruiter shortlisted your application";

    case "ACCEPTED":
      return "Congratulations! Your application was accepted";

    case "REJECTED":
      return "Application was not selected";

    default:
      return "Application status updated";
  }
}

function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.PENDING;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${config.className}`}
    >
      <Icon size={13} />
      {config.label}
    </span>
  );
}

export default function AppliedJobs() {
  const [applications, setApplications] = useState([]);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadApplications = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getMyApplications();

        const rawApplications =
          response?.data?.applications ||
          response?.applications ||
          (Array.isArray(response?.data) ? response.data : []) ||
          [];

        if (mounted) {
          setApplications(rawApplications.map(normalizeApplication));
        }
      } catch (requestError) {
        if (!mounted) return;

        setError(
          requestError?.response?.data?.message ||
            "Unable to load your applications. Please try again.",
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadApplications();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredApplications = useMemo(() => {
    const query = search.toLowerCase().trim();

    return applications.filter((application) => {
      const matchesStatus =
        activeFilter === "ALL" ||
        application.status === activeFilter;

      const matchesSearch =
        !query ||
        application.title.toLowerCase().includes(query) ||
        application.company.toLowerCase().includes(query) ||
        application.location.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [activeFilter, search, applications]);

  const stats = useMemo(
    () => ({
      total: applications.length,
      active: applications.filter(
        (item) => !["REJECTED", "ACCEPTED"].includes(item.status),
      ).length,
      shortlisted: applications.filter(
        (item) => item.status === "SHORTLISTED",
      ).length,
      interviews: 0,
    }),
    [applications],
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-600">
                Job Seeker
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                Applied Jobs
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Track every application and its current hiring stage.
              </p>
            </div>

            <Link
              to="/jobs"
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <Search size={16} />
              Find More Jobs
            </Link>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total Applications"
            value={stats.total}
            icon={BriefcaseBusiness}
            iconClass="bg-blue-50 text-blue-600"
          />

          <StatCard
            label="Active Applications"
            value={stats.active}
            icon={Clock3}
            iconClass="bg-amber-50 text-amber-600"
          />

          <StatCard
            label="Shortlisted"
            value={stats.shortlisted}
            icon={CheckCircle2}
            iconClass="bg-violet-50 text-violet-600"
          />

          <StatCard
            label="Interviews"
            value={stats.interviews}
            icon={CalendarDays}
            iconClass="bg-emerald-50 text-emerald-600"
          />
        </div>

        {/* Filters */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search applications by job, company or location..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {filters.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setActiveFilter(filter.value)}
                  className={`whitespace-nowrap rounded-lg px-3.5 py-2 text-sm font-medium transition ${
                    activeFilter === filter.value
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <p className="mt-4 text-sm font-medium text-slate-600">
              Loading your applications...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center">
            <XCircle className="mx-auto text-red-500" size={28} />

            <h2 className="mt-3 text-lg font-bold text-red-900">
              Unable to load applications
            </h2>

            <p className="mt-2 text-sm text-red-700">{error}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Application List */}
        {!loading && !error && (
          <div className="mt-5 space-y-4">
            {filteredApplications.length > 0 ? (
              filteredApplications.map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                />
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <FileText size={24} />
                </div>

                <h2 className="mt-4 text-lg font-bold text-slate-900">
                  No applications found
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  {applications.length === 0
                    ? "You have not applied to any jobs yet."
                    : "Try changing your search or status filter."}
                </p>

                {applications.length === 0 && (
                  <Link
                    to="/jobs"
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    <Search size={16} />
                    Find Jobs
                  </Link>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, iconClass }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon size={19} />
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            {label}
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-900">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function ApplicationCard({ application }) {
  const initials =
    application.company
      ?.split(" ")
      .map((word) => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "CO";

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
        <div className="flex min-w-0 flex-1 gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-600">
            {initials}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              {application.jobId ? (
                <Link
                  to={`/jobs/${application.jobId}`}
                  className="text-lg font-bold text-slate-900 transition hover:text-blue-600"
                >
                  {application.title}
                </Link>
              ) : (
                <h2 className="text-lg font-bold text-slate-900">
                  {application.title}
                </h2>
              )}

              <StatusBadge status={application.status} />
            </div>

            <div className="mt-1 flex items-center gap-2 text-sm font-medium text-slate-600">
              <Building2 size={15} />
              {application.company}
            </div>

            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <MapPin size={15} />
                {application.location}
              </span>

              <span className="flex items-center gap-1.5">
                <BriefcaseBusiness size={15} />
                {application.type}
              </span>

              <span className="flex items-center gap-1.5">
                <Clock3 size={15} />
                Applied {formatDate(application.appliedDate)}
              </span>

              {application.salary !== "Salary not disclosed" && (
                <span>{application.salary}</span>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4 lg:w-72 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Current status
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-800">
            {application.nextStep}
          </p>

          {application.jobId && (
            <Link
              to={`/jobs/${application.jobId}`}
              className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
            >
              View Job
              <ChevronRight size={15} />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
