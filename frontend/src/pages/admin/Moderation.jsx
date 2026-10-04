import { useMemo, useState } from "react";
import {
  ShieldCheck,
  Search,
  AlertTriangle,
  Clock3,
  CheckCircle2,
  XCircle,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  BriefcaseBusiness,
  Building2,
  UserRound,
  Filter,
} from "lucide-react";

import DashboardLayout from "../../components/DashboardLayout";

const navItems = [
  { label: "Dashboard", path: "/admin", icon: ShieldCheck },
  { label: "Users", path: "/admin/users", icon: UserRound },
  { label: "Companies", path: "/admin/companies", icon: Building2 },
  { label: "Jobs", path: "/admin/jobs", icon: BriefcaseBusiness },
  { label: "Moderation", path: "/admin/moderation", icon: ShieldCheck },
];

const initialReports = [
  {
    id: "RPT-1001",
    title: "Suspicious job description",
    target: "Frontend Developer",
    company: "Northstar Technologies",
    type: "Job listing",
    reason: "Misleading information",
    priority: "High",
    status: "Pending",
    reportedBy: "Aarav Sharma",
    date: "Oct 04, 2026",
    description:
      "The reporter believes that the job description contains misleading details about the role and compensation.",
  },
  {
    id: "RPT-1002",
    title: "Potential fake company profile",
    target: "Vertex Digital",
    company: "Vertex Digital",
    type: "Company",
    reason: "Unverified business",
    priority: "High",
    status: "Pending",
    reportedBy: "Priya Mehta",
    date: "Oct 03, 2026",
    description:
      "The company profile has been reported for verification. Review its information before taking action.",
  },
  {
    id: "RPT-1003",
    title: "Duplicate job posting",
    target: "Backend Developer",
    company: "BrightPath Solutions",
    type: "Job listing",
    reason: "Duplicate content",
    priority: "Medium",
    status: "Under Review",
    reportedBy: "Rahul Verma",
    date: "Oct 02, 2026",
    description:
      "A user reported that this position may duplicate another listing from the same company.",
  },
  {
    id: "RPT-1004",
    title: "Inappropriate job content",
    target: "Sales Executive",
    company: "Orbit Commerce",
    type: "Job listing",
    reason: "Policy violation",
    priority: "High",
    status: "Pending",
    reportedBy: "Neha Kapoor",
    date: "Oct 01, 2026",
    description:
      "The report alleges that some content in this job listing may violate platform guidelines.",
  },
  {
    id: "RPT-1005",
    title: "Incorrect company details",
    target: "BluePeak Finance",
    company: "BluePeak Finance",
    type: "Company",
    reason: "Incorrect information",
    priority: "Low",
    status: "Resolved",
    reportedBy: "Kabir Singh",
    date: "Sep 30, 2026",
    description:
      "The company details were reported for review. This sample report has already been marked resolved.",
  },
  {
    id: "RPT-1006",
    title: "Potential misleading vacancy",
    target: "Product Manager",
    company: "Studio Meridian",
    type: "Job listing",
    reason: "Misleading information",
    priority: "Medium",
    status: "Pending",
    reportedBy: "Ananya Gupta",
    date: "Sep 28, 2026",
    description:
      "The reporter requests a review of the advertised position and its stated requirements.",
  },
];

function statusStyle(status) {
  if (status === "Resolved") {
    return "bg-emerald-50 text-emerald-700";
  }

  if (status === "Under Review") {
    return "bg-blue-50 text-blue-700";
  }

  return "bg-amber-50 text-amber-700";
}

function priorityStyle(priority) {
  if (priority === "High") {
    return "bg-rose-50 text-rose-700";
  }

  if (priority === "Medium") {
    return "bg-amber-50 text-amber-700";
  }

  return "bg-slate-100 text-slate-600";
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

export default function Moderation() {
  const [reports, setReports] = useState(initialReports);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [selectedReport, setSelectedReport] = useState(null);
  const [page, setPage] = useState(1);
  const [notice, setNotice] = useState("");
  const pageSize = 5;

  const filteredReports = useMemo(() => {
    const query = search.trim().toLowerCase();

    return reports.filter((report) => {
      const matchesSearch =
        !query ||
        report.id.toLowerCase().includes(query) ||
        report.title.toLowerCase().includes(query) ||
        report.target.toLowerCase().includes(query) ||
        report.company.toLowerCase().includes(query) ||
        report.reason.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || report.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All" || report.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [reports, search, statusFilter, priorityFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredReports.length / pageSize),
  );
  const currentPage = Math.min(page, totalPages);

  const visibleReports = filteredReports.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const pendingCount = reports.filter(
    (report) => report.status === "Pending",
  ).length;

  const reviewCount = reports.filter(
    (report) => report.status === "Under Review",
  ).length;

  const resolvedCount = reports.filter(
    (report) => report.status === "Resolved",
  ).length;

  const highPriorityCount = reports.filter(
    (report) =>
      report.priority === "High" && report.status !== "Resolved",
  ).length;

  function updateReport(reportId, nextStatus) {
    setReports((current) =>
      current.map((report) =>
        report.id === reportId
          ? { ...report, status: nextStatus }
          : report,
      ),
    );

    setSelectedReport(null);
    setNotice(`Report ${reportId} marked as ${nextStatus.toLowerCase()}.`);

    window.setTimeout(() => setNotice(""), 3000);
  }

  return (
    <DashboardLayout title="Content Moderation" navItems={navItems}>
      <main className="mx-auto max-w-[1600px] space-y-7 pb-8">
        {/* Page header */}
        <section>
          <p className="text-sm font-medium text-slate-500">
            Administration / Moderation
          </p>

          <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-[#172b4d] sm:text-3xl">
                Content moderation
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Review reported content and manage moderation cases.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 self-start rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
              <AlertTriangle size={17} />
              {highPriorityCount} high-priority open reports
            </div>
          </div>
        </section>

        {/* Summary cards */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Total reports"
            value={reports.length}
            icon={ShieldCheck}
            color="bg-blue-50 text-blue-700"
          />

          <MetricCard
            label="Pending reports"
            value={pendingCount}
            icon={Clock3}
            color="bg-amber-50 text-amber-700"
          />

          <MetricCard
            label="Under review"
            value={reviewCount}
            icon={Eye}
            color="bg-violet-50 text-violet-700"
          />

          <MetricCard
            label="Resolved reports"
            value={resolvedCount}
            icon={CheckCircle2}
            color="bg-emerald-50 text-emerald-700"
          />
        </section>

        {/* Reports table */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-[#172b4d]">
                Report queue
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {filteredReports.length} matching reports
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(220px,1fr)_160px_150px]">
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
                  placeholder="Search reports..."
                  aria-label="Search moderation reports"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value);
                  setPage(1);
                }}
                aria-label="Filter by report status"
                className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none focus:border-blue-400"
              >
                <option value="All">All statuses</option>
                <option value="Pending">Pending</option>
                <option value="Under Review">Under review</option>
                <option value="Resolved">Resolved</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(event) => {
                  setPriorityFilter(event.target.value);
                  setPage(1);
                }}
                aria-label="Filter by report priority"
                className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none focus:border-blue-400"
              >
                <option value="All">All priorities</option>
                <option value="High">High priority</option>
                <option value="Medium">Medium priority</option>
                <option value="Low">Low priority</option>
              </select>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead>
                <tr className="border-y border-slate-100 bg-slate-50/70 text-xs uppercase tracking-wider text-slate-400">
                  <th className="px-4 py-4 font-bold">Report</th>
                  <th className="px-4 py-4 font-bold">Target</th>
                  <th className="px-4 py-4 font-bold">Priority</th>
                  <th className="px-4 py-4 font-bold">Reported on</th>
                  <th className="px-4 py-4 font-bold">Status</th>
                  <th className="px-4 py-4 text-right font-bold">Action</th>
                </tr>
              </thead>

              <tbody>
                {visibleReports.map((report) => (
                  <tr
                    key={report.id}
                    className="border-b border-slate-100 transition hover:bg-slate-50/70 last:border-0"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-start gap-3">
                        <div className="rounded-xl bg-amber-50 p-3 text-amber-700">
                          <AlertTriangle size={18} />
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-800">
                            {report.title}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {report.id} · {report.reason}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <p className="text-sm font-semibold text-slate-700">
                        {report.target}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {report.type}
                      </p>
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${priorityStyle(report.priority)}`}
                      >
                        {report.priority}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-sm text-slate-500">
                      {report.date}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${statusStyle(report.status)}`}
                      >
                        {report.status}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedReport(report)}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                      >
                        <Eye size={15} />
                        Review
                      </button>
                    </td>
                  </tr>
                ))}

                {visibleReports.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-14 text-center">
                      <Filter
                        size={28}
                        className="mx-auto text-slate-300"
                      />

                      <p className="mt-3 text-sm font-bold text-slate-700">
                        No reports found
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Try another search or change your filters.
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
              {filteredReports.length === 0
                ? 0
                : (currentPage - 1) * pageSize + 1}
              {"–"}
              {Math.min(
                currentPage * pageSize,
                filteredReports.length,
              )}{" "}
              of {filteredReports.length} reports
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
          This page currently uses sample reports. Connect your moderation API
          to load actual reports and persist review decisions.
        </p>

        {/* Feedback message */}
        {notice && (
          <div
            role="status"
            className="fixed bottom-5 right-5 z-[60] max-w-[calc(100vw-40px)] rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm font-semibold text-emerald-700 shadow-xl"
          >
            <span className="flex items-center gap-2">
              <CheckCircle2 size={17} />
              {notice}
            </span>
          </div>
        )}

        {/* Report review modal */}
        {selectedReport && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setSelectedReport(null);
              }
            }}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="report-dialog-title"
              className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-700">
                    Moderation case · {selectedReport.id}
                  </p>

                  <h2
                    id="report-dialog-title"
                    className="mt-2 text-xl font-black text-[#172b4d]"
                  >
                    {selectedReport.title}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {selectedReport.target}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedReport(null)}
                  aria-label="Close dialog"
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={19} />
                </button>
              </div>

              <div className="mt-6 space-y-4">
                {[
                  ["Company / target", selectedReport.company],
                  ["Content type", selectedReport.type],
                  ["Report reason", selectedReport.reason],
                  ["Reported by", selectedReport.reportedBy],
                  ["Reported on", selectedReport.date],
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
                <p className="text-xs font-bold text-slate-600">
                  Report description
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {selectedReport.description}
                </p>

                <p className="mt-3 text-xs text-slate-500">
                  Current status: {selectedReport.status}
                </p>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() =>
                    updateReport(selectedReport.id, "Under Review")
                  }
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 text-sm font-bold text-white transition hover:bg-blue-700"
                >
                  <Eye size={17} />
                  Mark under review
                </button>

                <button
                  type="button"
                  onClick={() =>
                    updateReport(selectedReport.id, "Resolved")
                  }
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 text-sm font-bold text-white transition hover:bg-emerald-700"
                >
                  <CheckCircle2 size={17} />
                  Resolve report
                </button>

                <button
                  type="button"
                  onClick={() =>
                    updateReport(selectedReport.id, "Pending")
                  }
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 text-sm font-bold text-amber-700 transition hover:bg-amber-100 sm:col-span-2"
                >
                  <Clock3 size={17} />
                  Return to pending
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedReport(null)}
                  className="h-11 rounded-xl border border-slate-200 px-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 sm:col-span-2"
                >
                  Close
                </button>
              </div>
            </section>
          </div>
        )}
      </main>
    </DashboardLayout>
  );
}
