import { useMemo, useState } from "react";
import {
  Search,
  BriefcaseBusiness,
  Building2,
  Users,
  ShieldCheck,
  Clock3,
  CheckCircle2,
  XCircle,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  MapPin,
  CalendarDays,
  IndianRupee,
} from "lucide-react";

import DashboardLayout from "../../components/DashboardLayout";

const navItems = [
  { label: "Dashboard", path: "/admin", icon: BriefcaseBusiness },
  { label: "Users", path: "/admin/users", icon: Users },
  { label: "Companies", path: "/admin/companies", icon: Building2 },
  { label: "Jobs", path: "/admin/jobs", icon: BriefcaseBusiness },
  { label: "Moderation", path: "/admin/moderation", icon: ShieldCheck },
];

const initialJobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "Northstar Technologies",
    location: "Gurugram, India",
    type: "Full-time",
    salary: "₹12–18 LPA",
    applicants: 84,
    status: "Pending",
    posted: "Oct 04, 2026",
  },
  {
    id: 2,
    title: "Backend Developer",
    company: "BrightPath Solutions",
    location: "Bengaluru, India",
    type: "Full-time",
    salary: "₹10–16 LPA",
    applicants: 62,
    status: "Active",
    posted: "Oct 03, 2026",
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: "Vertex Digital",
    location: "Noida, India",
    type: "Hybrid",
    salary: "₹8–12 LPA",
    applicants: 43,
    status: "Pending",
    posted: "Oct 02, 2026",
  },
  {
    id: 4,
    title: "Product Manager",
    company: "BluePeak Finance",
    location: "Mumbai, India",
    type: "Full-time",
    salary: "₹18–25 LPA",
    applicants: 105,
    status: "Active",
    posted: "Oct 01, 2026",
  },
  {
    id: 5,
    title: "Junior React Developer",
    company: "Orbit Commerce",
    location: "Remote",
    type: "Remote",
    salary: "₹4–7 LPA",
    applicants: 37,
    status: "Rejected",
    posted: "Sep 30, 2026",
  },
  {
    id: 6,
    title: "Data Analyst",
    company: "GreenGrid Energy",
    location: "Pune, India",
    type: "Full-time",
    salary: "₹6–10 LPA",
    applicants: 51,
    status: "Active",
    posted: "Sep 28, 2026",
  },
  {
    id: 7,
    title: "HR Business Partner",
    company: "Studio Meridian",
    location: "Hyderabad, India",
    type: "Hybrid",
    salary: "₹9–14 LPA",
    applicants: 29,
    status: "Pending",
    posted: "Sep 27, 2026",
  },
  {
    id: 8,
    title: "Software Engineer",
    company: "Northstar Technologies",
    location: "Gurugram, India",
    type: "Full-time",
    salary: "₹8–14 LPA",
    applicants: 76,
    status: "Active",
    posted: "Sep 26, 2026",
  },
];

function statusStyle(status) {
  if (status === "Active") {
    return "bg-emerald-50 text-emerald-700";
  }

  if (status === "Rejected") {
    return "bg-rose-50 text-rose-700";
  }

  return "bg-amber-50 text-amber-700";
}

function MetricCard({ label, value, icon: Icon, color }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-200 hover:shadow-lg hover:shadow-slate-200/40">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <div className={`rounded-xl p-3 ${color}`}>
          <Icon size={20} />
        </div>
      </div>

      <p className="mt-4 text-3xl font-black tracking-tight text-[#172b4d]">
        {value}
      </p>
    </article>
  );
}

export default function Jobs() {
  const [jobs, setJobs] = useState(initialJobs);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [selectedJob, setSelectedJob] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return jobs.filter((job) => {
      const matchesSearch =
        !query ||
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || job.status === statusFilter;

      const matchesType =
        typeFilter === "All" || job.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [jobs, search, statusFilter, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const visibleJobs = filteredJobs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const activeCount = jobs.filter((job) => job.status === "Active").length;
  const pendingCount = jobs.filter((job) => job.status === "Pending").length;
  const rejectedCount = jobs.filter((job) => job.status === "Rejected").length;

  const totalApplications = jobs.reduce(
    (total, job) => total + job.applicants,
    0,
  );

  function updateJobStatus(jobId, nextStatus) {
    setJobs((current) =>
      current.map((job) =>
        job.id === jobId ? { ...job, status: nextStatus } : job,
      ),
    );

    setSelectedJob(null);
  }

  function exportJobs() {
    const header = [
      "Job title",
      "Company",
      "Location",
      "Type",
      "Salary",
      "Applicants",
      "Status",
      "Posted",
    ];

    const rows = filteredJobs.map((job) => [
      job.title,
      job.company,
      job.location,
      job.type,
      job.salary,
      job.applicants,
      job.status,
      job.posted,
    ]);

    const csv = [header, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\n");

    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" }),
    );

    const link = document.createElement("a");
    link.href = url;
    link.download = "job-portal-jobs.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <DashboardLayout title="Job Management" navItems={navItems}>
      <main className="mx-auto max-w-[1600px] space-y-7 pb-8">
        {/* Header */}
        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Administration / Jobs
            </p>

            <h1 className="mt-2 text-2xl font-black tracking-tight text-[#172b4d] sm:text-3xl">
              Job management
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Review job listings, monitor applications, and manage publishing
              status.
            </p>
          </div>

          <button
            type="button"
            onClick={exportJobs}
            className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl bg-[#0066b3] px-4 text-sm font-bold text-white transition hover:bg-[#005493]"
          >
            <Download size={17} />
            Export CSV
          </button>
        </section>

        {/* Summary */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Total listings"
            value={jobs.length}
            icon={BriefcaseBusiness}
            color="bg-blue-50 text-blue-700"
          />

          <MetricCard
            label="Active jobs"
            value={activeCount}
            icon={CheckCircle2}
            color="bg-emerald-50 text-emerald-700"
          />

          <MetricCard
            label="Pending review"
            value={pendingCount}
            icon={Clock3}
            color="bg-amber-50 text-amber-700"
          />

          <MetricCard
            label="Applications"
            value={totalApplications}
            icon={Users}
            color="bg-violet-50 text-violet-700"
          />
        </section>

        {/* Filters and table */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-[#172b4d]">
                All job listings
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {filteredJobs.length} jobs match your filters
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(220px,1fr)_155px_155px]">
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Search title, company..."
                  aria-label="Search jobs"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value);
                  setPage(1);
                }}
                aria-label="Filter by job status"
                className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none focus:border-blue-400"
              >
                <option value="All">All statuses</option>
                <option value="Pending">Pending</option>
                <option value="Active">Active</option>
                <option value="Rejected">Rejected</option>
              </select>

              <select
                value={typeFilter}
                onChange={(event) => {
                  setTypeFilter(event.target.value);
                  setPage(1);
                }}
                aria-label="Filter by job type"
                className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none focus:border-blue-400"
              >
                <option value="All">All job types</option>
                <option value="Full-time">Full-time</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead>
                <tr className="border-y border-slate-100 bg-slate-50/70 text-xs uppercase tracking-wider text-slate-400">
                  <th className="px-4 py-4 font-bold">Job listing</th>
                  <th className="px-4 py-4 font-bold">Job type</th>
                  <th className="px-4 py-4 font-bold">Applicants</th>
                  <th className="px-4 py-4 font-bold">Posted date</th>
                  <th className="px-4 py-4 font-bold">Status</th>
                  <th className="px-4 py-4 text-right font-bold">Action</th>
                </tr>
              </thead>

              <tbody>
                {visibleJobs.map((job) => (
                  <tr
                    key={job.id}
                    className="border-b border-slate-100 transition hover:bg-slate-50/70 last:border-0"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-start gap-3">
                        <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
                          <BriefcaseBusiness size={19} />
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-800">
                            {job.title}
                          </p>

                          <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                            <Building2 size={13} />
                            {job.company}
                          </p>

                          <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                            <MapPin size={13} />
                            {job.location}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-600">
                        {job.type}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-2 text-sm font-bold text-slate-700">
                        <Users size={15} className="text-slate-400" />
                        {job.applicants}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-2 text-sm text-slate-500">
                        <CalendarDays size={14} />
                        {job.posted}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${statusStyle(job.status)}`}
                      >
                        {job.status}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedJob(job)}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                      >
                        <Eye size={15} />
                        Review
                      </button>
                    </td>
                  </tr>
                ))}

                {visibleJobs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-14 text-center">
                      <BriefcaseBusiness
                        size={28}
                        className="mx-auto text-slate-300"
                      />

                      <p className="mt-3 text-sm font-bold text-slate-700">
                        No jobs found
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Try another search or change the filters.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">
              Showing{" "}
              {filteredJobs.length === 0
                ? 0
                : (currentPage - 1) * pageSize + 1}
              {"–"}
              {Math.min(currentPage * pageSize, filteredJobs.length)} of{" "}
              {filteredJobs.length} jobs
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() =>
                  setPage((value) => Math.max(1, value - 1))
                }
                className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={15} />
                Previous
              </button>

              <span className="px-2 text-xs font-semibold text-slate-500">
                {currentPage} / {totalPages}
              </span>

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setPage((value) =>
                    Math.min(totalPages, value + 1),
                  )
                }
                className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </section>

        <p className="text-xs leading-5 text-slate-400">
          This page currently uses sample job records. Review actions update
          temporary frontend state only; connect the admin API for persistent
          moderation.
        </p>

        {/* Job review modal */}
        {selectedJob && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setSelectedJob(null);
              }
            }}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="job-dialog-title"
              className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-700">
                    Job listing review
                  </p>

                  <h2
                    id="job-dialog-title"
                    className="mt-2 text-xl font-black text-[#172b4d]"
                  >
                    {selectedJob.title}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {selectedJob.company}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedJob(null)}
                  aria-label="Close dialog"
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={19} />
                </button>
              </div>

              <div className="mt-6 space-y-4">
                {[
                  ["Location", selectedJob.location],
                  ["Employment type", selectedJob.type],
                  ["Salary range", selectedJob.salary],
                  ["Applications", selectedJob.applicants],
                  ["Posted date", selectedJob.posted],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 last:border-0"
                  >
                    <span className="text-sm text-slate-500">{label}</span>

                    <span className="max-w-[60%] text-right text-sm font-semibold text-slate-800">
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Current status</p>

                <span
                  className={`mt-2 inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${statusStyle(selectedJob.status)}`}
                >
                  {selectedJob.status}
                </span>

                <p className="mt-3 text-xs leading-5 text-slate-500">
                  Use the actions below to change this demo listing's status.
                </p>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => updateJobStatus(selectedJob.id, "Active")}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 text-sm font-bold text-white transition hover:bg-emerald-700"
                >
                  <CheckCircle2 size={17} />
                  Approve / publish
                </button>

                <button
                  type="button"
                  onClick={() => updateJobStatus(selectedJob.id, "Rejected")}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 text-sm font-bold text-rose-700 transition hover:bg-rose-100"
                >
                  <XCircle size={17} />
                  Reject listing
                </button>

                <button
                  type="button"
                  onClick={() => updateJobStatus(selectedJob.id, "Pending")}
                  className="h-11 rounded-xl border border-slate-200 px-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 sm:col-span-2"
                >
                  Return to pending review
                </button>
              </div>
            </section>
          </div>
        )}
      </main>
    </DashboardLayout>
  );
}
