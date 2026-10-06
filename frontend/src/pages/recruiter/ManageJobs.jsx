import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Edit3,
  MapPin,
  Plus,
  Search,
  Trash2,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
  createJob,
  deleteJob,
  getMyJobs,
  updateJob,
} from "../../services/jobService";

import { getMyCompany } from "../../services/companyService";

const emptyJob = {
  title: "",
  location: "",
  employmentType: "FULL_TIME",
  workplaceType: "HYBRID",
  experienceLevel: "ENTRY_LEVEL",
  salaryMin: "",
  salaryMax: "",
  applicationDeadline: "",
  skills: "",
  requirements: "",
  description: "",
};

const filters = ["All", "Active", "Closed"];

const inputClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-50";

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

  return String(value)
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
}

function formatSalary(min, max) {
  if (min == null && max == null) {
    return null;
  }

  if (min != null && max != null) {
    return `₹${Number(min).toLocaleString(
      "en-IN",
    )} – ₹${Number(max).toLocaleString("en-IN")}`;
  }

  if (min != null) {
    return `From ₹${Number(min).toLocaleString(
      "en-IN",
    )}`;
  }

  return `Up to ₹${Number(max).toLocaleString(
    "en-IN",
  )}`;
}

function parseCommaSeparatedValues(value) {
  if (!value.trim()) return [];

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeJob(job) {
  return {
    ...job,
    id: job?._id || job?.id,
  };
}

function getApiErrorMessage(error, fallback) {
  const responseData = error?.response?.data;

  if (responseData?.errors?.length) {
    return responseData.errors
      .map((item) => item.message)
      .filter(Boolean)
      .join(" ");
  }

  return responseData?.message || fallback;
}

function StatusBadge({ status }) {
  const active = status === "OPEN";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
        active
          ? "bg-emerald-50 text-emerald-700"
          : "bg-slate-100 text-slate-600"
      }`}
    >
      {active ? (
        <CheckCircle2 size={13} />
      ) : (
        <XCircle size={13} />
      )}

      {active ? "Active" : "Closed"}
    </span>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-slate-500">
          {label}
        </p>

        <span
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}
        >
          <Icon size={18} />
        </span>
      </div>

      <p className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">
        {value}
      </p>
    </div>
  );
}

export default function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [company, setCompany] = useState(null);

  const [loading, setLoading] = useState(true);
  const [companyLoading, setCompanyLoading] =
    useState(true);

  const [activeFilter, setActiveFilter] =
    useState("All");

  const [searchQuery, setSearchQuery] =
    useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingJobId, setEditingJobId] =
    useState(null);

  const [form, setForm] = useState({
    ...emptyJob,
  });

  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [actionId, setActionId] = useState(null);

  async function loadCompany() {
    try {
      setCompanyLoading(true);

      const response = await getMyCompany();

      setCompany(
        response?.data?.company ||
          response?.data ||
          null,
      );
    } catch (error) {
      if (error?.response?.status === 404) {
        setCompany(null);
      } else {
        toast.error(
          getApiErrorMessage(
            error,
            "Unable to load company profile.",
          ),
        );
      }
    } finally {
      setCompanyLoading(false);
    }
  }

  async function loadJobs() {
    try {
      setLoading(true);

      const response = await getMyJobs({
        page: 1,
        limit: 100,
      });

      const data = Array.isArray(response?.data)
        ? response.data
        : [];

      setJobs(data.map(normalizeJob));
    } catch (error) {
      setJobs([]);

      toast.error(
        getApiErrorMessage(
          error,
          "Unable to load your job postings.",
        ),
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCompany();
    loadJobs();
  }, []);

  const stats = useMemo(
    () => ({
      total: jobs.length,

      active: jobs.filter(
        (job) => job.status === "OPEN",
      ).length,

      closed: jobs.filter(
        (job) => job.status === "CLOSED",
      ).length,

      applicants: jobs.reduce(
        (sum, job) =>
          sum + (Number(job.applicants) || 0),
        0,
      ),
    }),
    [jobs],
  );

  const filteredJobs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return jobs.filter((job) => {
      const matchesFilter =
        activeFilter === "All" ||
        (activeFilter === "Active" &&
          job.status === "OPEN") ||
        (activeFilter === "Closed" &&
          job.status === "CLOSED");

      const values = [
        job.title,
        job.location,
        job.employmentType,
        job.workplaceType,
        job.experienceLevel,
      ];

      const matchesSearch =
        !query ||
        values.some((value) =>
          String(value || "")
            .toLowerCase()
            .includes(query),
        );

      return matchesFilter && matchesSearch;
    });
  }, [jobs, activeFilter, searchQuery]);

  function openCreateModal() {
    setEditingJobId(null);
    setForm({ ...emptyJob });
    setFormError("");
    setModalOpen(true);
  }

  function openEditModal(job) {
    setEditingJobId(job.id);

    setForm({
      title: job.title || "",
      location: job.location || "",
      employmentType:
        job.employmentType || "FULL_TIME",
      workplaceType:
        job.workplaceType || "HYBRID",
      experienceLevel:
        job.experienceLevel || "ENTRY_LEVEL",
      salaryMin: job.salaryMin ?? "",
      salaryMax: job.salaryMax ?? "",
      applicationDeadline: job.applicationDeadline
        ? new Date(job.applicationDeadline)
            .toISOString()
            .slice(0, 10)
        : "",
      skills: Array.isArray(job.skills)
        ? job.skills.join(", ")
        : "",
      requirements: Array.isArray(job.requirements)
        ? job.requirements.join("\n")
        : "",
      description: job.description || "",
    });

    setFormError("");
    setModalOpen(true);
  }

  function updateField(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setFormError("");

    if (
      !form.title.trim() ||
      !form.location.trim() ||
      !form.description.trim()
    ) {
      setFormError(
        "Job title, location and description are required.",
      );
      return;
    }

    if (form.description.trim().length < 20) {
      setFormError(
        "Job description must contain at least 20 characters.",
      );
      return;
    }

    if (!company?._id) {
      setFormError(
        "Please create your company profile before posting a job.",
      );
      return;
    }

    const minSalary =
      form.salaryMin === ""
        ? null
        : Number(form.salaryMin);

    const maxSalary =
      form.salaryMax === ""
        ? null
        : Number(form.salaryMax);

    if (
      (minSalary !== null &&
        (!Number.isFinite(minSalary) ||
          minSalary < 0)) ||
      (maxSalary !== null &&
        (!Number.isFinite(maxSalary) ||
          maxSalary < 0)) ||
      (minSalary !== null &&
        maxSalary !== null &&
        maxSalary < minSalary)
    ) {
      setFormError(
        "Please enter a valid salary range.",
      );
      return;
    }

    if (
      form.applicationDeadline &&
      new Date(form.applicationDeadline) <
        new Date()
    ) {
      setFormError(
        "Application deadline cannot be in the past.",
      );
      return;
    }

    const skills = parseCommaSeparatedValues(
      form.skills,
    );

    const requirements = form.requirements
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    const payload = {
      title: form.title.trim(),
      company: company._id,
      location: form.location.trim(),
      employmentType: form.employmentType,
      workplaceType: form.workplaceType,
      experienceLevel: form.experienceLevel,
      description: form.description.trim(),
      requirements,
      skills,
      salaryMin: minSalary,
      salaryMax: maxSalary,
      applicationDeadline: form.applicationDeadline
        ? new Date(
            `${form.applicationDeadline}T23:59:59`,
          ).toISOString()
        : null,
    };

    try {
      setSubmitting(true);

      if (editingJobId) {
        const response = await updateJob(
          editingJobId,
          payload,
        );

        const updatedJob = normalizeJob(
          response?.data,
        );

        setJobs((current) =>
          current.map((job) =>
            job.id === editingJobId
              ? updatedJob
              : job,
          ),
        );

        toast.success(
          "Job updated successfully.",
        );
      } else {
        const response = await createJob(payload);

        const createdJob = normalizeJob(
          response?.data,
        );

        setJobs((current) => [
          createdJob,
          ...current,
        ]);

        toast.success(
          "Job published successfully.",
        );
      }

      setModalOpen(false);
      setForm({ ...emptyJob });
      setEditingJobId(null);
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        "Unable to save the job.",
      );

      setFormError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleJobStatus(job) {
    try {
      setActionId(job.id);

      const nextStatus =
        job.status === "OPEN"
          ? "CLOSED"
          : "OPEN";

      const response = await updateJob(job.id, {
        status: nextStatus,
      });

      const updatedJob = normalizeJob(
        response?.data,
      );

      setJobs((current) =>
        current.map((item) =>
          item.id === job.id
            ? updatedJob
            : item,
        ),
      );

      toast.success(
        nextStatus === "OPEN"
          ? "Job reopened successfully."
          : "Job closed successfully.",
      );
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          "Unable to update job status.",
        ),
      );
    } finally {
      setActionId(null);
    }
  }

  async function handleDeleteJob(job) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${job.title}"?`,
    );

    if (!confirmed) return;

    try {
      setActionId(job.id);

      await deleteJob(job.id);

      setJobs((current) =>
        current.filter(
          (item) => item.id !== job.id,
        ),
      );

      toast.success(
        "Job deleted successfully.",
      );
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          "Unable to delete this job.",
        ),
      );
    } finally {
      setActionId(null);
    }
  }

  const statCards = [
    {
      label: "Total job postings",
      value: stats.total,
      icon: BriefcaseBusiness,
      color: "bg-blue-50 text-blue-700",
    },
    {
      label: "Active jobs",
      value: stats.active,
      icon: CheckCircle2,
      color:
        "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Closed jobs",
      value: stats.closed,
      icon: Clock3,
      color: "bg-slate-100 text-slate-600",
    },
    {
      label: "Total applicants",
      value: stats.applicants,
      icon: Users,
      color:
        "bg-violet-50 text-violet-700",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-7 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              to="/recruiter"
              className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-700"
            >
              <ArrowLeft size={16} />
              Back to dashboard
            </Link>

            <p className="text-xs font-bold tracking-[0.18em] text-blue-700">
              RECRUITER WORKSPACE
            </p>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Manage job postings
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
              Create job listings, manage openings
              and track applicants.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            disabled={
              companyLoading ||
              !company?._id
            }
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={18} />
            Post a new job
          </button>
        </div>

        {!companyLoading && !company?._id && (
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            <strong>Company profile required.</strong>{" "}
            Create your company profile before posting
            jobs.
            <Link
              to="/recruiter/company-profile"
              className="ml-2 font-bold underline"
            >
              Create profile
            </Link>
          </div>
        )}

        {/* Stats */}
        <section className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {statCards.map((stat) => (
            <StatCard
              key={stat.label}
              {...stat}
            />
          ))}
        </section>

        {/* Filters */}
        <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() =>
                    setActiveFilter(filter)
                  }
                  className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    activeFilter === filter
                      ? "bg-[#0066b3] text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="relative w-full lg:max-w-sm">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(
                    event.target.value,
                  )
                }
                placeholder="Search your jobs..."
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>
        </section>

        {/* Jobs */}
        <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="flex min-h-64 items-center justify-center text-slate-500">
              Loading jobs...
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="p-12 text-center">
              <BriefcaseBusiness
                size={34}
                className="mx-auto text-slate-300"
              />

              <h3 className="mt-4 font-bold text-slate-700">
                No jobs found
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                Create your first job posting to
                start receiving applications.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredJobs.map((job) => {
                const salary = formatSalary(
                  job.salaryMin,
                  job.salaryMax,
                );

                return (
                  <article
                    key={job.id}
                    className="p-5 transition hover:bg-slate-50/60 sm:p-6"
                  >
                    <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-lg font-bold text-[#172b4d]">
                            {job.title}
                          </h3>

                          <StatusBadge
                            status={job.status}
                          />
                        </div>

                        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin size={15} />
                            {job.location ||
                              "Location not specified"}
                          </span>

                          <span>
                            {formatEnum(
                              job.employmentType,
                            )}
                          </span>

                          <span>
                            {formatEnum(
                              job.workplaceType,
                            )}
                          </span>

                          <span>
                            {formatEnum(
                              job.experienceLevel,
                            )}
                          </span>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-400">
                          <span>
                            Posted{" "}
                            {formatDate(
                              job.createdAt,
                            )}
                          </span>

                          {job.applicationDeadline && (
                            <span>
                              Deadline{" "}
                              {formatDate(
                                job.applicationDeadline,
                              )}
                            </span>
                          )}

                          {salary && (
                            <span className="font-semibold text-slate-500">
                              {salary}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          to={`/recruiter/applicants?job=${job.id}`}
                          className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                        >
                          <Users size={16} />
                          Applicants
                        </Link>

                        <button
                          type="button"
                          onClick={() =>
                            openEditModal(job)
                          }
                          className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                        >
                          <Edit3 size={16} />
                          Edit
                        </button>

                        <button
                          type="button"
                          disabled={
                            actionId === job.id
                          }
                          onClick={() =>
                            toggleJobStatus(job)
                          }
                          className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                        >
                          {job.status === "OPEN"
                            ? "Close"
                            : "Reopen"}
                        </button>

                        <button
                          type="button"
                          disabled={
                            actionId === job.id
                          }
                          onClick={() =>
                            handleDeleteJob(job)
                          }
                          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-red-100 text-red-500 hover:bg-red-50 disabled:opacity-50"
                          title="Delete job"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-bold text-[#172b4d]">
                  {editingJobId
                    ? "Edit job posting"
                    : "Create job posting"}
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  This information will be visible to
                  job seekers.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setModalOpen(false)
                }
                className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-5 sm:p-6"
            >
              {formError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
                  {formError}
                </div>
              )}

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="sm:col-span-2">
                  <span className="text-sm font-semibold text-slate-700">
                    Job title
                  </span>

                  <input
                    name="title"
                    value={form.title}
                    onChange={updateField}
                    placeholder="e.g. Backend Developer"
                    className={inputClass}
                  />
                </label>

                <label>
                  <span className="text-sm font-semibold text-slate-700">
                    Location
                  </span>

                  <input
                    name="location"
                    value={form.location}
                    onChange={updateField}
                    placeholder="e.g. Gurugram, Haryana"
                    className={inputClass}
                  />
                </label>

                <label>
                  <span className="text-sm font-semibold text-slate-700">
                    Employment type
                  </span>

                  <select
                    name="employmentType"
                    value={form.employmentType}
                    onChange={updateField}
                    className={inputClass}
                  >
                    <option value="FULL_TIME">
                      Full-time
                    </option>
                    <option value="PART_TIME">
                      Part-time
                    </option>
                    <option value="CONTRACT">
                      Contract
                    </option>
                    <option value="INTERNSHIP">
                      Internship
                    </option>
                    <option value="FREELANCE">
                      Freelance
                    </option>
                  </select>
                </label>

                <label>
                  <span className="text-sm font-semibold text-slate-700">
                    Workplace
                  </span>

                  <select
                    name="workplaceType"
                    value={form.workplaceType}
                    onChange={updateField}
                    className={inputClass}
                  >
                    <option value="ON_SITE">
                      On-site
                    </option>
                    <option value="HYBRID">
                      Hybrid
                    </option>
                    <option value="REMOTE">
                      Remote
                    </option>
                  </select>
                </label>

                <label>
                  <span className="text-sm font-semibold text-slate-700">
                    Experience
                  </span>

                  <select
                    name="experienceLevel"
                    value={form.experienceLevel}
                    onChange={updateField}
                    className={inputClass}
                  >
                    <option value="ENTRY_LEVEL">
                      Entry level
                    </option>
                    <option value="MID_LEVEL">
                      Mid level
                    </option>
                    <option value="SENIOR_LEVEL">
                      Senior level
                    </option>
                    <option value="LEAD">
                      Lead
                    </option>
                    <option value="MANAGER">
                      Manager
                    </option>
                  </select>
                </label>

                <label>
                  <span className="text-sm font-semibold text-slate-700">
                    Minimum salary
                  </span>

                  <input
                    type="number"
                    min="0"
                    name="salaryMin"
                    value={form.salaryMin}
                    onChange={updateField}
                    placeholder="400000"
                    className={inputClass}
                  />
                </label>

                <label>
                  <span className="text-sm font-semibold text-slate-700">
                    Maximum salary
                  </span>

                  <input
                    type="number"
                    min="0"
                    name="salaryMax"
                    value={form.salaryMax}
                    onChange={updateField}
                    placeholder="700000"
                    className={inputClass}
                  />
                </label>

                <label>
                  <span className="text-sm font-semibold text-slate-700">
                    Application deadline
                  </span>

                  <input
                    type="date"
                    name="applicationDeadline"
                    value={form.applicationDeadline}
                    onChange={updateField}
                    className={inputClass}
                  />
                </label>

                <label className="sm:col-span-2">
                  <span className="text-sm font-semibold text-slate-700">
                    Skills
                  </span>

                  <input
                    name="skills"
                    value={form.skills}
                    onChange={updateField}
                    placeholder="Node.js, Express, MongoDB, React"
                    className={inputClass}
                  />

                  <span className="mt-1 block text-xs text-slate-400">
                    Separate skills with commas.
                  </span>
                </label>

                <label className="sm:col-span-2">
                  <span className="text-sm font-semibold text-slate-700">
                    Requirements
                  </span>

                  <textarea
                    name="requirements"
                    value={form.requirements}
                    onChange={updateField}
                    rows={5}
                    placeholder={
                      "Bachelor's degree\nGood communication\nREST API experience"
                    }
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                  />

                  <span className="mt-1 block text-xs text-slate-400">
                    One requirement per line.
                  </span>
                </label>

                <label className="sm:col-span-2">
                  <span className="text-sm font-semibold text-slate-700">
                    Description
                  </span>

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={updateField}
                    rows={7}
                    placeholder="Describe the role, responsibilities and what the candidate will work on..."
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-sm leading-6 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                  />
                </label>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() =>
                    setModalOpen(false)
                  }
                  className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="h-11 rounded-xl bg-[#0066b3] px-6 text-sm font-bold text-white hover:bg-[#005596] disabled:opacity-50"
                >
                  {submitting
                    ? "Saving..."
                    : editingJobId
                      ? "Update Job"
                      : "Publish Job"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}