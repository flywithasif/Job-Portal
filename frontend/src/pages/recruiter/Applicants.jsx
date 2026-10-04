
import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronDown,
  Download,
  FileText,
  Search,
  Users,
  X,
} from "lucide-react";

import {
  readRecruiterData,
  writeRecruiterData,
  RECRUITER_STORAGE_KEYS,
} from "../../utils/recruiterStorage";

const initialApplicants = [
  {
    id: 1,
    name: "Rahul Verma",
    email: "rahul@example.com",
    job: "Junior Backend Developer",
    experience: "1 year",
    appliedOn: "2026-10-02",
    status: "Applied",
    skills: ["Node.js", "Express", "MongoDB"],
    resumeUrl: "",
  },
  {
    id: 2,
    name: "Priya Sharma",
    email: "priya@example.com",
    job: "MERN Stack Developer",
    experience: "2 years",
    appliedOn: "2026-10-01",
    status: "Shortlisted",
    skills: ["React", "Node.js", "MongoDB"],
    resumeUrl: "",
  },
  {
    id: 3,
    name: "Aman Singh",
    email: "aman@example.com",
    job: "Junior Backend Developer",
    experience: "Fresher",
    appliedOn: "2026-09-30",
    status: "Interview",
    skills: ["JavaScript", "Node.js", "REST API"],
    resumeUrl: "",
  },
  {
    id: 4,
    name: "Neha Gupta",
    email: "neha@example.com",
    job: "Frontend Developer Intern",
    experience: "Fresher",
    appliedOn: "2026-09-29",
    status: "Rejected",
    skills: ["HTML", "CSS", "React"],
    resumeUrl: "",
  },
  {
    id: 5,
    name: "Vikram Yadav",
    email: "vikram@example.com",
    job: "MERN Stack Developer",
    experience: "3 years",
    appliedOn: "2026-09-27",
    status: "Applied",
    skills: ["React", "Express", "MongoDB"],
    resumeUrl: "",
  },
  {
    id: 6,
    name: "Ananya Mehta",
    email: "ananya@example.com",
    job: "Junior Backend Developer",
    experience: "1 year",
    appliedOn: "2026-09-25",
    status: "Shortlisted",
    skills: ["Node.js", "JWT", "MongoDB"],
    resumeUrl: "",
  },
];

const statusOptions = [
  "Applied",
  "Shortlisted",
  "Interview",
  "Rejected",
  "Hired",
];

const filters = ["All", ...statusOptions];

const statusStyles = {
  Applied: "bg-blue-50 text-blue-700",
  Shortlisted: "bg-violet-50 text-violet-700",
  Interview: "bg-amber-50 text-amber-700",
  Rejected: "bg-red-50 text-red-700",
  Hired: "bg-emerald-50 text-emerald-700",
};

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatDate(dateString) {
  if (!dateString) return "—";

  const date = new Date(`${dateString}T12:00:00`);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-slate-500">{title}</p>

        <span
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}
        >
          <Icon size={19} />
        </span>
      </div>

      <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
        {value}
      </p>
    </div>
  );
}

function ApplicantRow({ applicant, onStatusChange, onView }) {
  return (
    <tr className="transition hover:bg-slate-50/80">
      <td className="px-5 py-5">
        <button
          type="button"
          onClick={() => onView(applicant)}
          className="flex min-w-52 items-center gap-3 text-left"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-blue-700">
            {getInitials(applicant.name)}
          </span>

          <span>
            <span className="block font-semibold text-slate-900 hover:text-blue-700">
              {applicant.name}
            </span>

            <span className="mt-1 block text-xs text-slate-500">
              {applicant.email}
            </span>
          </span>
        </button>
      </td>

      <td className="min-w-52 px-5 py-5">
        <p className="font-medium text-slate-800">{applicant.job}</p>

        <p className="mt-1 text-xs text-slate-500">
          {applicant.experience} experience
        </p>
      </td>

      <td className="min-w-52 px-5 py-5">
        <div className="flex flex-wrap gap-1.5">
          {(applicant.skills || []).map((skill) => (
            <span
              key={skill}
              className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600"
            >
              {skill}
            </span>
          ))}
        </div>
      </td>

      <td className="whitespace-nowrap px-5 py-5 text-sm text-slate-500">
        {formatDate(applicant.appliedOn)}
      </td>

      <td className="px-5 py-5">
        <span
          className={`inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${
            statusStyles[applicant.status] || statusStyles.Applied
          }`}
        >
          {applicant.status}
        </span>
      </td>

      <td className="px-5 py-5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onView(applicant)}
            aria-label={`View ${applicant.name}`}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          >
            <ArrowUpRight size={16} />
          </button>

          <select
            aria-label={`Update status for ${applicant.name}`}
            value={applicant.status}
            onChange={(event) =>
              onStatusChange(applicant.id, event.target.value)
            }
            className="h-9 max-w-36 rounded-lg border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-700 outline-none focus:border-blue-400"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </td>
    </tr>
  );
}

export default function Applicants() {
  const [applicants, setApplicants] = useState(() =>
    readRecruiterData(
      RECRUITER_STORAGE_KEYS.applicants,
      initialApplicants,
    ),
  );

  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [jobFilter, setJobFilter] = useState("All jobs");
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [notice, setNotice] = useState("");

  // Save applicant changes locally.
  useEffect(() => {
    writeRecruiterData(
      RECRUITER_STORAGE_KEYS.applicants,
      applicants,
    );
  }, [applicants]);

  // Clear the success message automatically.
  useEffect(() => {
    if (!notice) return undefined;

    const timeoutId = window.setTimeout(() => {
      setNotice("");
    }, 3000);

    return () => window.clearTimeout(timeoutId);
  }, [notice]);

  const jobOptions = useMemo(
    () => [...new Set(applicants.map((applicant) => applicant.job))],
    [applicants],
  );

  const stats = useMemo(
    () => ({
      total: applicants.length,
      shortlisted: applicants.filter(
        (applicant) => applicant.status === "Shortlisted",
      ).length,
      interviews: applicants.filter(
        (applicant) => applicant.status === "Interview",
      ).length,
      hired: applicants.filter(
        (applicant) => applicant.status === "Hired",
      ).length,
    }),
    [applicants],
  );

  const filteredApplicants = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return applicants.filter((applicant) => {
      const matchesStatus =
        activeFilter === "All" ||
        applicant.status === activeFilter;

      const matchesJob =
        jobFilter === "All jobs" ||
        applicant.job === jobFilter;

      const searchableValues = [
        applicant.name || "",
        applicant.email || "",
        applicant.job || "",
        applicant.experience || "",
        ...(applicant.skills || []),
      ];

      const matchesSearch = searchableValues.some((value) =>
        value.toLowerCase().includes(query),
      );

      return matchesStatus && matchesJob && matchesSearch;
    });
  }, [applicants, activeFilter, jobFilter, searchQuery]);

  function updateApplicantStatus(id, status) {
    const applicant = applicants.find((item) => item.id === id);

    setApplicants((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status } : item,
      ),
    );

    setSelectedApplicant((current) =>
      current?.id === id ? { ...current, status } : current,
    );

    setNotice(
      `${applicant?.name ?? "Applicant"} status updated to ${status}.`,
    );
  }

  const statCards = [
    {
      title: "Total applicants",
      value: stats.total,
      icon: Users,
      color: "bg-blue-50 text-blue-700",
    },
    {
      title: "Shortlisted",
      value: stats.shortlisted,
      icon: Check,
      color: "bg-violet-50 text-violet-700",
    },
    {
      title: "Interviews",
      value: stats.interviews,
      icon: CalendarDays,
      color: "bg-amber-50 text-amber-700",
    },
    {
      title: "Hired",
      value: stats.hired,
      icon: BriefcaseBusiness,
      color: "bg-emerald-50 text-emerald-700",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-7 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page heading */}
        <div>
          <p className="text-xs font-bold tracking-[0.18em] text-blue-700">
            RECRUITER WORKSPACE
          </p>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Applicants
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Review candidates, manage application statuses and keep
            your hiring process organized.
          </p>
        </div>

        {/* Statistics */}
        <section className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {statCards.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </section>

        {/* Applicant management */}
        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 p-4 sm:p-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Candidate applications
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {filteredApplicants.length} applicant
                  {filteredApplicants.length !== 1 ? "s" : ""} found
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {/* Search candidates */}
                <div className="relative">
                  <Search
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(event) =>
                      setSearchQuery(event.target.value)
                    }
                    placeholder="Search candidates..."
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50 sm:w-64"
                  />
                </div>

                {/* Filter by job */}
                <div className="relative">
                  <BriefcaseBusiness
                    size={16}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <select
                    value={jobFilter}
                    onChange={(event) =>
                      setJobFilter(event.target.value)
                    }
                    className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-10 pr-9 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 sm:w-64"
                  >
                    <option value="All jobs">All jobs</option>

                    {jobOptions.map((job) => (
                      <option key={job} value={job}>
                        {job}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </div>
            </div>

            {/* Status filters */}
            <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
              {filters.map((filter) => {
                const count =
                  filter === "All"
                    ? applicants.length
                    : applicants.filter(
                        (item) => item.status === filter,
                      ).length;

                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                      activeFilter === filter
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800"
                    }`}
                  >
                    {filter}

                    <span
                      className={`rounded-md px-1.5 py-0.5 text-xs ${
                        activeFilter === filter
                          ? "bg-white/15 text-white"
                          : "bg-white text-slate-500"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Applicant table */}
          {filteredApplicants.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80">
                    {[
                      "Candidate",
                      "Applied for",
                      "Skills",
                      "Applied on",
                      "Status",
                      "Actions",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredApplicants.map((applicant) => (
                    <ApplicantRow
                      key={applicant.id}
                      applicant={applicant}
                      onStatusChange={updateApplicantStatus}
                      onView={setSelectedApplicant}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-5 py-16 text-center">
              <Users
                size={30}
                className="mx-auto text-slate-300"
              />

              <h3 className="mt-4 font-bold text-slate-900">
                No applicants found
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Try changing your search, job selection or status filter.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setJobFilter("All jobs");
                  setActiveFilter("All");
                }}
                className="mt-4 text-sm font-semibold text-blue-700 hover:text-blue-800"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>

        <p className="mt-4 text-xs leading-5 text-slate-400">
          Demo data only. Applicant records are stored in this
          browser's localStorage, not in the backend yet.
        </p>
      </div>

      {/* Status update notification */}
      {notice && (
        <div
          role="status"
          className="fixed bottom-5 right-4 z-[60] flex max-w-sm items-center gap-3 rounded-xl border border-emerald-200 bg-white px-4 py-3.5 text-sm font-semibold text-slate-800 shadow-xl sm:right-6"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
            <Check size={17} />
          </span>

          {notice}
        </div>
      )}

      {/* Applicant details modal */}
      {selectedApplicant && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedApplicant(null);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="applicant-details-title"
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between border-b border-slate-100 p-5 sm:p-6">
              <div>
                <p className="text-xs font-bold tracking-widest text-blue-700">
                  CANDIDATE PROFILE
                </p>

                <h2
                  id="applicant-details-title"
                  className="mt-2 text-xl font-bold text-slate-900"
                >
                  Applicant details
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedApplicant(null)}
                aria-label="Close applicant details"
                className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 sm:p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-lg font-bold text-blue-700">
                  {getInitials(selectedApplicant.name)}
                </div>

                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-slate-900">
                    {selectedApplicant.name}
                  </h3>

                  <p className="mt-1 break-all text-sm text-slate-500">
                    {selectedApplicant.email}
                  </p>

                  <span
                    className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      statusStyles[selectedApplicant.status] ||
                      statusStyles.Applied
                    }`}
                  >
                    {selectedApplicant.status}
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-500">
                    Applied position
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {selectedApplicant.job}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      Experience
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {selectedApplicant.experience}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      Application date
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {formatDate(selectedApplicant.appliedOn)}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Skills
                  </p>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {(selectedApplicant.skills || []).map((skill) => (
                      <span
                        key={skill}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-dashed border-slate-300 p-4">
                  <div className="flex items-center gap-3">
                    <FileText
                      size={21}
                      className="text-slate-500"
                    />

                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-800">
                        Candidate resume
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {selectedApplicant.resumeUrl
                          ? "Resume available"
                          : "No resume file attached in demo data"}
                      </p>
                    </div>

                    {selectedApplicant.resumeUrl && (
                      <a
                        href={selectedApplicant.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-700 hover:text-blue-800"
                        aria-label="Open candidate resume"
                      >
                        <Download size={18} />
                      </a>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="applicant-status"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Update application status
                  </label>

                  <select
                    id="applicant-status"
                    value={selectedApplicant.status}
                    onChange={(event) =>
                      updateApplicantStatus(
                        selectedApplicant.id,
                        event.target.value,
                      )
                    }
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedApplicant(null)}
                className="mt-6 h-11 w-full rounded-xl bg-slate-900 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Close profile
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
