import { useMemo, useState } from "react";
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

const applications = [
  {
    id: 1,
    jobId: 1,
    title: "Senior Frontend Developer",
    company: "TechNova Solutions",
    location: "Gurugram, Haryana",
    appliedDate: "28 Sep 2026",
    status: "Interview",
    type: "Full-time",
    salary: "₹10L - ₹16L",
    nextStep: "Interview scheduled",
  },
  {
    id: 2,
    jobId: 2,
    title: "React Developer",
    company: "DigitalCraft Labs",
    location: "Remote",
    appliedDate: "25 Sep 2026",
    status: "Under Review",
    type: "Full-time",
    salary: "₹8L - ₹14L",
    nextStep: "Recruiter is reviewing your profile",
  },
  {
    id: 3,
    jobId: 3,
    title: "MERN Stack Developer",
    company: "CloudPeak Technologies",
    location: "Noida, Uttar Pradesh",
    appliedDate: "21 Sep 2026",
    status: "Shortlisted",
    type: "Full-time",
    salary: "₹7L - ₹12L",
    nextStep: "Recruiter shortlisted your application",
  },
  {
    id: 4,
    jobId: 4,
    title: "Backend Developer",
    company: "CodeSphere Technologies",
    location: "Bengaluru, Karnataka",
    appliedDate: "18 Sep 2026",
    status: "Rejected",
    type: "Full-time",
    salary: "₹8L - ₹13L",
    nextStep: "Application was not selected",
  },
  {
    id: 5,
    jobId: 5,
    title: "Software Engineer",
    company: "InnovateX",
    location: "Pune, Maharashtra",
    appliedDate: "15 Sep 2026",
    status: "Applied",
    type: "Full-time",
    salary: "₹6L - ₹10L",
    nextStep: "Application submitted successfully",
  },
];

const statusConfig = {
  Applied: {
    className: "bg-blue-50 text-blue-700 border-blue-100",
    icon: FileText,
  },
  "Under Review": {
    className: "bg-amber-50 text-amber-700 border-amber-100",
    icon: Clock3,
  },
  Shortlisted: {
    className: "bg-violet-50 text-violet-700 border-violet-100",
    icon: CheckCircle2,
  },
  Interview: {
    className: "bg-emerald-50 text-emerald-700 border-emerald-100",
    icon: CalendarDays,
  },
  Rejected: {
    className: "bg-red-50 text-red-700 border-red-100",
    icon: XCircle,
  },
};

function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.Applied;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${config.className}`}
    >
      <Icon size={13} />
      {status}
    </span>
  );
}

export default function AppliedJobs() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filters = [
    "All",
    "Applied",
    "Under Review",
    "Shortlisted",
    "Interview",
    "Rejected",
  ];

  const filteredApplications = useMemo(() => {
    const query = search.toLowerCase().trim();

    return applications.filter((application) => {
      const matchesStatus =
        activeFilter === "All" || application.status === activeFilter;

      const matchesSearch =
        !query ||
        application.title.toLowerCase().includes(query) ||
        application.company.toLowerCase().includes(query) ||
        application.location.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [activeFilter, search]);

  const stats = {
    total: applications.length,
    active: applications.filter(
      (item) => !["Rejected"].includes(item.status),
    ).length,
    interview: applications.filter((item) => item.status === "Interview")
      .length,
    shortlisted: applications.filter(
      (item) => item.status === "Shortlisted",
    ).length,
  };

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
            value={stats.interview}
            icon={CalendarDays}
            iconClass="bg-emerald-50 text-emerald-600"
          />
        </div>

        {/* Filters */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4">
            {/* Search */}
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

            {/* Status Filters */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`whitespace-nowrap rounded-lg px-3.5 py-2 text-sm font-medium transition ${
                    activeFilter === filter
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Application List */}
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
                Try changing your search or status filter.
              </p>
            </div>
          )}
        </div>
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

          <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

function ApplicationCard({ application }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
        {/* Main Information */}
        <div className="flex min-w-0 flex-1 gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-600">
            {application.company
              .split(" ")
              .map((word) => word[0])
              .slice(0, 2)
              .join("")}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to={`/applications/${application.id}`}
                className="text-lg font-bold text-slate-900 transition hover:text-blue-600"
              >
                {application.title}
              </Link>

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
                Applied {application.appliedDate}
              </span>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="border-t border-slate-100 pt-4 lg:w-72 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Current status
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-800">
            {application.nextStep}
          </p>

          <Link
            to={`/applications/${application.id}`}
            className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
          >
            View Job
            <ChevronRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}