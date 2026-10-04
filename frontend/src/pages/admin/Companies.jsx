import { useMemo, useState } from "react";
import {
  Building2,
  Search,
  ShieldCheck,
  Clock3,
  CheckCircle2,
  XCircle,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Users,
  BriefcaseBusiness,
} from "lucide-react";

import DashboardLayout from "../../components/DashboardLayout";

const navItems = [
  { label: "Dashboard", path: "/admin", icon: Building2 },
  { label: "Users", path: "/admin/users", icon: Users },
  { label: "Companies", path: "/admin/companies", icon: Building2 },
  { label: "Jobs", path: "/admin/jobs", icon: BriefcaseBusiness },
  { label: "Moderation", path: "/admin/moderation", icon: ShieldCheck },
];

const initialCompanies = [
  {
    id: 1,
    name: "Northstar Technologies",
    email: "hr@northstar.example",
    industry: "Information Technology",
    location: "Gurugram, India",
    employees: "201–500",
    jobs: 18,
    status: "Pending",
    initials: "NT",
    joined: "Oct 02, 2026",
  },
  {
    id: 2,
    name: "BrightPath Solutions",
    email: "careers@brightpath.example",
    industry: "Consulting",
    location: "Bengaluru, India",
    employees: "51–200",
    jobs: 12,
    status: "Verified",
    initials: "BP",
    joined: "Oct 01, 2026",
  },
  {
    id: 3,
    name: "Vertex Digital",
    email: "talent@vertex.example",
    industry: "Software",
    location: "Noida, India",
    employees: "11–50",
    jobs: 7,
    status: "Pending",
    initials: "VD",
    joined: "Sep 29, 2026",
  },
  {
    id: 4,
    name: "BluePeak Finance",
    email: "people@bluepeak.example",
    industry: "Financial Services",
    location: "Mumbai, India",
    employees: "501–1000",
    jobs: 9,
    status: "Verified",
    initials: "BF",
    joined: "Sep 27, 2026",
  },
  {
    id: 5,
    name: "Orbit Commerce",
    email: "jobs@orbitcommerce.example",
    industry: "E-commerce",
    location: "Delhi, India",
    employees: "51–200",
    jobs: 5,
    status: "Rejected",
    initials: "OC",
    joined: "Sep 25, 2026",
  },
  {
    id: 6,
    name: "GreenGrid Energy",
    email: "careers@greengrid.example",
    industry: "Renewable Energy",
    location: "Pune, India",
    employees: "201–500",
    jobs: 4,
    status: "Verified",
    initials: "GE",
    joined: "Sep 23, 2026",
  },
  {
    id: 7,
    name: "Studio Meridian",
    email: "team@meridian.example",
    industry: "Design",
    location: "Hyderabad, India",
    employees: "11–50",
    jobs: 3,
    status: "Pending",
    initials: "SM",
    joined: "Sep 21, 2026",
  },
];

function statusStyle(status) {
  if (status === "Verified") {
    return "bg-emerald-50 text-emerald-700";
  }

  if (status === "Rejected") {
    return "bg-rose-50 text-rose-700";
  }

  return "bg-amber-50 text-amber-700";
}

function MetricCard({ title, value, icon: Icon, iconStyle }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-200 hover:shadow-lg hover:shadow-slate-200/40">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div className={`rounded-xl p-3 ${iconStyle}`}>
          <Icon size={20} />
        </div>
      </div>
      <p className="mt-4 text-3xl font-black tracking-tight text-[#172b4d]">
        {value}
      </p>
    </article>
  );
}

export default function Companies() {
  const [companies, setCompanies] = useState(initialCompanies);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filteredCompanies = useMemo(() => {
    const query = search.trim().toLowerCase();

    return companies.filter((company) => {
      const matchesSearch =
        !query ||
        company.name.toLowerCase().includes(query) ||
        company.email.toLowerCase().includes(query) ||
        company.industry.toLowerCase().includes(query) ||
        company.location.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || company.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [companies, search, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCompanies.length / pageSize),
  );
  const currentPage = Math.min(page, totalPages);
  const visibleCompanies = filteredCompanies.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const verifiedCount = companies.filter(
    (company) => company.status === "Verified",
  ).length;

  const pendingCount = companies.filter(
    (company) => company.status === "Pending",
  ).length;

  const rejectedCount = companies.filter(
    (company) => company.status === "Rejected",
  ).length;

  function updateStatus(companyId, nextStatus) {
    setCompanies((current) =>
      current.map((company) =>
        company.id === companyId
          ? { ...company, status: nextStatus }
          : company,
      ),
    );

    setSelectedCompany(null);
  }

  function exportCompanies() {
    const header = [
      "Company",
      "Email",
      "Industry",
      "Location",
      "Employees",
      "Active jobs",
      "Status",
      "Joined",
    ];

    const rows = filteredCompanies.map((company) => [
      company.name,
      company.email,
      company.industry,
      company.location,
      company.employees,
      company.jobs,
      company.status,
      company.joined,
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
    link.download = "job-portal-companies.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <DashboardLayout title="Company Management" navItems={navItems}>
      <main className="mx-auto max-w-[1600px] space-y-7 pb-8">
        {/* Page header */}
        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Administration / Companies
            </p>

            <h1 className="mt-2 text-2xl font-black tracking-tight text-[#172b4d] sm:text-3xl">
              Company management
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Review company profiles, verify businesses, and monitor their
              job listings.
            </p>
          </div>

          <button
            type="button"
            onClick={exportCompanies}
            className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl bg-[#0066b3] px-4 text-sm font-bold text-white transition hover:bg-[#005493]"
          >
            <Download size={17} />
            Export CSV
          </button>
        </section>

        {/* Summary cards */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Total companies"
            value={companies.length}
            icon={Building2}
            iconStyle="bg-blue-50 text-blue-700"
          />

          <MetricCard
            title="Verified companies"
            value={verifiedCount}
            icon={CheckCircle2}
            iconStyle="bg-emerald-50 text-emerald-700"
          />

          <MetricCard
            title="Pending verification"
            value={pendingCount}
            icon={Clock3}
            iconStyle="bg-amber-50 text-amber-700"
          />

          <MetricCard
            title="Rejected profiles"
            value={rejectedCount}
            icon={XCircle}
            iconStyle="bg-rose-50 text-rose-700"
          />
        </section>

        {/* Company table */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-[#172b4d]">
                Registered companies
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {filteredCompanies.length} companies match your filters
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(240px,1fr)_190px]">
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
                  placeholder="Search company, industry, city..."
                  aria-label="Search companies"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value);
                  setPage(1);
                }}
                aria-label="Filter companies by status"
                className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none focus:border-blue-400"
              >
                <option value="All">All statuses</option>
                <option value="Pending">Pending</option>
                <option value="Verified">Verified</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead>
                <tr className="border-y border-slate-100 bg-slate-50/70 text-xs uppercase tracking-wider text-slate-400">
                  <th className="px-4 py-4 font-bold">Company</th>
                  <th className="px-4 py-4 font-bold">Industry</th>
                  <th className="px-4 py-4 font-bold">Location</th>
                  <th className="px-4 py-4 font-bold">Active jobs</th>
                  <th className="px-4 py-4 font-bold">Verification</th>
                  <th className="px-4 py-4 text-right font-bold">Action</th>
                </tr>
              </thead>

              <tbody>
                {visibleCompanies.map((company) => (
                  <tr
                    key={company.id}
                    className="border-b border-slate-100 transition hover:bg-slate-50/70 last:border-0"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xs font-extrabold text-blue-700">
                          {company.initials}
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-800">
                            {company.name}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {company.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-sm text-slate-600">
                      {company.industry}
                    </td>

                    <td className="px-4 py-4 text-sm text-slate-600">
                      {company.location}
                    </td>

                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-2 text-sm font-bold text-slate-700">
                        <BriefcaseBusiness
                          size={15}
                          className="text-slate-400"
                        />
                        {company.jobs}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${statusStyle(company.status)}`}
                      >
                        {company.status}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedCompany(company)}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                      >
                        <Eye size={15} />
                        Review
                      </button>
                    </td>
                  </tr>
                ))}

                {visibleCompanies.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-14 text-center">
                      <Building2
                        size={28}
                        className="mx-auto text-slate-300"
                      />
                      <p className="mt-3 text-sm font-bold text-slate-700">
                        No companies found
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Try another search or change the status filter.
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
              {filteredCompanies.length === 0
                ? 0
                : (currentPage - 1) * pageSize + 1}
              {"–"}
              {Math.min(
                currentPage * pageSize,
                filteredCompanies.length,
              )}{" "}
              of {filteredCompanies.length} companies
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
          Demo company records are used on this page. Verification actions
          update temporary page state only; connect the admin API for
          persistent changes.
        </p>

        {/* Company review modal */}
        {selectedCompany && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setSelectedCompany(null);
              }
            }}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="company-dialog-title"
              className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 font-extrabold text-blue-700">
                    {selectedCompany.initials}
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-blue-700">
                      Company review
                    </p>
                    <h2
                      id="company-dialog-title"
                      className="mt-1 text-lg font-black text-[#172b4d]"
                    >
                      {selectedCompany.name}
                    </h2>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedCompany(null)}
                  aria-label="Close dialog"
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={19} />
                </button>
              </div>

              <div className="mt-6 space-y-4">
                {[
                  ["Contact email", selectedCompany.email],
                  ["Industry", selectedCompany.industry],
                  ["Location", selectedCompany.location],
                  ["Company size", selectedCompany.employees],
                  ["Active job listings", selectedCompany.jobs],
                  ["Registered", selectedCompany.joined],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 last:border-0"
                  >
                    <span className="text-sm text-slate-500">{label}</span>
                    <span className="max-w-[60%] break-words text-right text-sm font-semibold text-slate-800">
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Current status</p>
                <span
                  className={`mt-2 inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${statusStyle(selectedCompany.status)}`}
                >
                  {selectedCompany.status}
                </span>
                <p className="mt-3 text-xs leading-5 text-slate-500">
                  Review the company details before changing its demo
                  verification status.
                </p>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() =>
                    updateStatus(selectedCompany.id, "Verified")
                  }
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 text-sm font-bold text-white transition hover:bg-emerald-700"
                >
                  <CheckCircle2 size={17} />
                  Verify company
                </button>

                <button
                  type="button"
                  onClick={() =>
                    updateStatus(selectedCompany.id, "Rejected")
                  }
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 text-sm font-bold text-rose-700 transition hover:bg-rose-100"
                >
                  <XCircle size={17} />
                  Reject company
                </button>

                <button
                  type="button"
                  onClick={() =>
                    updateStatus(selectedCompany.id, "Pending")
                  }
                  className="h-11 rounded-xl border border-slate-200 px-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 sm:col-span-2"
                >
                  Mark as pending
                </button>
              </div>
            </section>
          </div>
        )}
      </main>
    </DashboardLayout>
  );
}
