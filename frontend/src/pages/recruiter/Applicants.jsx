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
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
  getJobApplications,
  updateApplicationStatus,
} from "../../services/applicationService";


const statusOptions = [
  "PENDING",
  "REVIEWING",
  "SHORTLISTED",
  "REJECTED",
  "ACCEPTED",
];

const filters = ["All", ...statusOptions];

const statusStyles = {
  PENDING: "bg-blue-50 text-blue-700",
  REVIEWING: "bg-amber-50 text-amber-700",
  SHORTLISTED: "bg-violet-50 text-violet-700",
  REJECTED: "bg-red-50 text-red-700",
  ACCEPTED: "bg-emerald-50 text-emerald-700",
};

const inputClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50";

function getInitials(name = "") {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "A"
  );
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatEnum(value) {
  if (!value) return "—";

  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getApiErrorMessage(error, fallback) {
  const responseData = error?.response?.data;

  if (responseData?.errors?.length > 0) {
    return responseData.errors
      .map((item) => item.message)
      .filter(Boolean)
      .join(" ");
  }

  return responseData?.message || fallback;
}

function getApplicantName(application) {
  return (
    application?.applicant?.name ||
    application?.user?.name ||
    application?.applicantName ||
    "Unknown applicant"
  );
}

function getApplicantEmail(application) {
  return (
    application?.applicant?.email ||
    application?.user?.email ||
    application?.applicantEmail ||
    "No email available"
  );
}

function getApplicantSkills(application) {
  const skills =
    application?.applicant?.skills ||
    application?.user?.skills ||
    application?.skills ||
    [];

  return Array.isArray(skills) ? skills : [];
}

function getJobTitle(application) {
  return (
    application?.job?.title ||
    application?.jobTitle ||
    "Job not available"
  );
}

function normalizeApplication(application) {
  const applicant =
    application?.applicant || application?.user || application?.applicantId;

  return {
    ...application,
    id: application?._id || application?.id,
    name: getApplicantName(application),
    email: getApplicantEmail(application),
    job: getJobTitle(application),
    skills: getApplicantSkills(application),
    resumeUrl:
      application?.resumeUrl ||
      application?.applicant?.resumeUrl ||
      application?.user?.resumeUrl ||
      "",
    coverLetter: application?.coverLetter || "",
    experience:
      application?.applicant?.experience?.length > 0
        ? `${application.applicant.experience.length} experience entries`
        : "Not specified",
    appliedOn:
      application?.createdAt ||
      application?.appliedOn ||
      application?.applicationDate ||
      null,
    status: application?.status || "PENDING",
    applicant,
  };
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

function ApplicantRow({ applicant, onStatusChange, onView, updatingId }) {
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
          {applicant.experience}
        </p>
      </td>

      <td className="min-w-52 px-5 py-5">
        <div className="flex flex-wrap gap-1.5">
          {applicant.skills.length > 0 ? (
            applicant.skills.slice(0, 6).map((skill) => (
              <span
                key={skill}
                className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600"
              >
                {skill}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-400">No skills listed</span>
          )}
        </div>
      </td>

      <td className="whitespace-nowrap px-5 py-5 text-sm text-slate-500">
        {formatDate(applicant.appliedOn)}
      </td>

      <td className="px-5 py-5">
        <span
          className={`inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${
            statusStyles[applicant.status] || statusStyles.PENDING
          }`}
        >
          {formatEnum(applicant.status)}
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
            disabled={updatingId === applicant.id}
            onChange={(event) =>
              onStatusChange(applicant.id, event.target.value)
            }
            className="h-9 max-w-40 rounded-lg border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-700 outline-none focus:border-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {formatEnum(status)}
              </option>
            ))}
          </select>
        </div>
      </td>
    </tr>
  );
}

export default function Applicants() {
  const [applications, setApplications] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [jobFilter, setJobFilter] = useState("All jobs");
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  async function loadApplications() {
    try {
      setLoading(true);

      const response = await getJobApplications();

      const backendApplications = Array.isArray(response?.data)
        ? response.data
        : [];

      setApplications(backendApplications.map(normalizeApplication));
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        "Unable to load candidate applications.",
      );

      setApplications([]);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadApplications();
  }, []);

  const jobOptions = useMemo(
    () => [...new Set(applications.map((application) => application.job))],
    [applications],
  );

  const stats = useMemo(
    () => ({
      total: applications.length,
      shortlisted: applications.filter(
        (application) => application.status === "SHORTLISTED",
      ).length,
      interviews: applications.filter(
        (application) => application.status === "REVIEWING",
      ).length,
      hired: applications.filter(
        (application) => application.status === "ACCEPTED",
      ).length,
    }),
    [applications],
  );

  const filteredApplications = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return applications.filter((application) => {
      const matchesStatus =
        activeFilter === "All" || application.status === activeFilter;

      const matchesJob =
        jobFilter === "All jobs" || application.job === jobFilter;

      const searchableValues = [
        application.name,
        application.email,
        application.job,
        application.experience,
        ...application.skills,
      ];

      const matchesSearch =
        !query ||
        searchableValues.some((value) =>
          String(value || "").toLowerCase().includes(query),
        );

      return matchesStatus && matchesJob && matchesSearch;
    });
  }, [applications, activeFilter, jobFilter, searchQuery]);

  async function handleStatusChange(applicationId, status) {
    const previousApplication = applications.find(
      (application) => application.id === applicationId,
    );

    if (!previousApplication) return;

    try {
      setUpdatingId(applicationId);

      const response = await updateApplicationStatus(applicationId, status);

      const updatedApplication = normalizeApplication(
        response?.data || {
          ...previousApplication,
          status,
        },
      );

      setApplications((current) =>
        current.map((application) =>
          application.id === applicationId
            ? updatedApplication
            : application,
        ),
      );

      setSelectedApplicant((current) =>
        current?.id === applicationId ? updatedApplication : current,
      );

      toast.success(
        `${previousApplication.name} status updated to ${formatEnum(status)}.`,
      );
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          "Unable to update application status.",
        ),
      );
    } finally {
      setUpdatingId(null);
    }
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
      title: "Under review",
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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold tracking-[0.18em] text-blue-700">
              RECRUITER WORKSPACE
            </p>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Applicants
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Review candidates, manage application statuses and keep your
              hiring process organized.
            </p>
          </div>

          <Link
            to="/recruiter/jobs"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          >
            <BriefcaseBusiness size={16} />
            Manage jobs
          </Link>
        </div>

        <section className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {statCards.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </section>

        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 p-4 sm:p-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Candidate applications
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {filteredApplications.length} applicant
                  {filteredApplications.length !== 1 ? "s" : ""} found
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="relative">
                  <Search
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search candidates..."
                    className={`${inputClass} pl-10 sm:w-64`}
                  />
                </div>

                <div className="relative">
                  <BriefcaseBusiness
                    size={16}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <select
                    value={jobFilter}
                    onChange={(event) => setJobFilter(event.target.value)}
                    className={`${inputClass} appearance-none pl-10 pr-9 sm:w-64`}
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

            <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
              {filters.map((filter) => {
                const count =
                  filter === "All"
                    ? applications.length
                    : applications.filter(
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
                    {filter === "All" ? "All" : formatEnum(filter)}

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

          {loading ? (
            <div className="flex min-h-80 items-center justify-center">
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-500">
                <Loader2 className="animate-spin" size={20} />
                Loading applications...
              </div>
            </div>
          ) : filteredApplications.length > 0 ? (
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
                  {filteredApplications.map((application) => (
                    <ApplicantRow
                      key={application.id}
                      applicant={application}
                      onStatusChange={handleStatusChange}
                      onView={setSelectedApplicant}
                      updatingId={updatingId}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-5 py-16 text-center">
              <Users size={30} className="mx-auto text-slate-300" />

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
          Applications are loaded from the backend API and status changes are
          saved to MongoDB.
        </p>
      </div>

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
                      statusStyles.PENDING
                    }`}
                  >
                    {formatEnum(selectedApplicant.status)}
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
                      Application date
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {formatDate(selectedApplicant.appliedOn)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      Status
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {formatEnum(selectedApplicant.status)}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-500">Skills</p>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedApplicant.skills.length > 0 ? (
                      selectedApplicant.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-slate-400">
                        No skills listed
                      </span>
                    )}
                  </div>
                </div>

                {selectedApplicant.coverLetter && (
                  <div className="rounded-xl border border-slate-200 p-4">
                    <p className="text-xs font-medium text-slate-500">
                      Cover letter
                    </p>

                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                      {selectedApplicant.coverLetter}
                    </p>
                  </div>
                )}

                <div className="rounded-xl border border-dashed border-slate-300 p-4">
                  <div className="flex items-center gap-3">
                    <FileText size={21} className="text-slate-500" />

                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-800">
                        Candidate resume
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {selectedApplicant.resumeUrl
                          ? "Resume available"
                          : "No resume URL attached"}
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
                    disabled={updatingId === selectedApplicant.id}
                    onChange={(event) =>
                      handleStatusChange(
                        selectedApplicant.id,
                        event.target.value,
                      )
                    }
                    className={`${inputClass} disabled:cursor-not-allowed disabled:opacity-60`}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {formatEnum(status)}
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
