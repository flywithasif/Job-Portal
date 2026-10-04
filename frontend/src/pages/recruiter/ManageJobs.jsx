
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
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

import {
  readRecruiterData,
  writeRecruiterData,
  RECRUITER_STORAGE_KEYS,
} from "../../utils/recruiterStorage";

const initialJobs = [
  {
    id: 1,
    title: "Junior Backend Developer",
    department: "Engineering",
    location: "Gurugram, Haryana",
    type: "Full-time",
    workplace: "Hybrid",
    salaryMin: "4",
    salaryMax: "7",
    openings: "2",
    experience: "0–2 years",
    description:
      "Build and maintain REST APIs using Node.js, Express.js and MongoDB. Collaborate with the engineering team to deliver reliable backend services.",
    status: "Active",
    applicants: 24,
    posted: "2026-10-01",
  },
  {
    id: 2,
    title: "MERN Stack Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    workplace: "Remote",
    salaryMin: "5",
    salaryMax: "9",
    openings: "3",
    experience: "1–3 years",
    description:
      "Develop full-stack applications using React, Node.js, Express and MongoDB.",
    status: "Active",
    applicants: 38,
    posted: "2026-09-28",
  },
  {
    id: 3,
    title: "Frontend Developer Intern",
    department: "Design & Engineering",
    location: "Noida, Uttar Pradesh",
    type: "Internship",
    workplace: "On-site",
    salaryMin: "1",
    salaryMax: "2",
    openings: "2",
    experience: "Fresher",
    description:
      "Build responsive user interfaces using React, JavaScript, HTML and CSS.",
    status: "Closed",
    applicants: 16,
    posted: "2026-09-20",
  },
];

const emptyJob = {
  title: "",
  department: "Engineering",
  location: "",
  type: "Full-time",
  workplace: "Hybrid",
  salaryMin: "",
  salaryMax: "",
  openings: "1",
  experience: "0–2 years",
  description: "",
};

const filters = ["All", "Active", "Closed"];

const inputClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-50";

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(`${value}T12:00:00`);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function StatusBadge({ status }) {
  const active = status === "Active";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
        active
          ? "bg-emerald-50 text-emerald-700"
          : "bg-slate-100 text-slate-600"
      }`}
    >
      {active ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
      {status}
    </span>
  );
}

function FormField({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </span>
      {children}
    </label>
  );
}

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium leading-5 text-slate-500 sm:text-sm">
          {label}
        </p>

        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${color}`}
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
  const [jobs, setJobs] = useState(() =>
    readRecruiterData(RECRUITER_STORAGE_KEYS.jobs, initialJobs),
  );

  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);
  const [form, setForm] = useState({ ...emptyJob });
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");

  // Persist job changes in this browser.
  useEffect(() => {
    writeRecruiterData(RECRUITER_STORAGE_KEYS.jobs, jobs);
  }, [jobs]);

  // Automatically clear success messages.
  useEffect(() => {
    if (!notice) return undefined;

    const timeoutId = window.setTimeout(() => setNotice(""), 3000);

    return () => window.clearTimeout(timeoutId);
  }, [notice]);

  const stats = useMemo(
    () => ({
      total: jobs.length,
      active: jobs.filter((job) => job.status === "Active").length,
      closed: jobs.filter((job) => job.status === "Closed").length,
      applicants: jobs.reduce(
        (sum, job) => sum + (Number(job.applicants) || 0),
        0,
      ),
    }),
    [jobs],
  );

  const filteredJobs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return jobs.filter((job) => {
      const matchesFilter =
        activeFilter === "All" || job.status === activeFilter;

      const matchesSearch = [
        job.title || "",
        job.department || "",
        job.location || "",
        job.type || "",
      ].some((value) => value.toLowerCase().includes(query));

      return matchesFilter && matchesSearch;
    });
  }, [jobs, activeFilter, searchQuery]);

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
      color: "bg-emerald-50 text-emerald-700",
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
      color: "bg-violet-50 text-violet-700",
    },
  ];

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
      department: job.department || "Engineering",
      location: job.location || "",
      type: job.type || "Full-time",
      workplace: job.workplace || "Hybrid",
      salaryMin: job.salaryMin ?? "",
      salaryMax: job.salaryMax ?? "",
      openings: String(job.openings ?? "1"),
      experience: job.experience || "0–2 years",
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

  function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    if (
      !form.title.trim() ||
      !form.location.trim() ||
      !form.description.trim()
    ) {
      setFormError(
        "Please fill in the job title, location and description.",
      );
      return;
    }

    const minSalary =
      form.salaryMin === "" ? null : Number(form.salaryMin);

    const maxSalary =
      form.salaryMax === "" ? null : Number(form.salaryMax);

    if (
      (minSalary !== null &&
        (!Number.isFinite(minSalary) || minSalary < 0)) ||
      (maxSalary !== null &&
        (!Number.isFinite(maxSalary) || maxSalary < 0)) ||
      (minSalary !== null &&
        maxSalary !== null &&
        maxSalary < minSalary)
    ) {
      setFormError("Please enter a valid salary range.");
      return;
    }

    const openings = Number(form.openings);

    if (!Number.isInteger(openings) || openings < 1) {
      setFormError("Number of openings must be at least 1.");
      return;
    }

    const cleanJob = {
      ...form,
      title: form.title.trim(),
      location: form.location.trim(),
      description: form.description.trim(),
      openings: String(openings),
    };

    if (editingJobId !== null) {
      setJobs((current) =>
        current.map((job) =>
          job.id === editingJobId ? { ...job, ...cleanJob } : job,
        ),
      );

      setNotice("Job posting updated successfully.");
    } else {
      setJobs((current) => [
        {
          ...cleanJob,
          id: Date.now(),
          status: "Active",
          applicants: 0,
          posted: new Date().toISOString().slice(0, 10),
        },
        ...current,
      ]);

      setNotice("Job posting created successfully.");
    }

    setModalOpen(false);
  }

  function toggleJobStatus(id) {
    setJobs((current) =>
      current.map((job) =>
        job.id === id
          ? {
              ...job,
              status: job.status === "Active" ? "Closed" : "Active",
            }
          : job,
      ),
    );

    setNotice("Job status updated successfully.");
  }

  function deleteJob(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this job posting?",
    );

    if (!confirmed) return;

    setJobs((current) => current.filter((job) => job.id !== id));
    setNotice("Job posting deleted successfully.");
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-7 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              to="/recruiter"
              className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-700"
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
              Create job listings, manage openings and track applicants.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Plus size={18} />
            Post a new job
          </button>
        </div>

        {/* Success notification */}
        {notice && (
          <div
            role="status"
            className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800"
          >
            {notice}
          </div>
        )}

        {/* Statistics */}
        <section className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {statCards.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </section>

        {/* Job listings */}
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 p-4 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Your job listings
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {filteredJobs.length} listing
                  {filteredJobs.length !== 1 ? "s" : ""} found
                </p>
              </div>

              <div className="relative w-full lg:max-w-sm">
                <Search
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search jobs, department or location..."
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>

            <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
              {filters.map((filter) => {
                const count =
                  filter === "All"
                    ? jobs.length
                    : jobs.filter((job) => job.status === filter).length;

                return (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFilter(filter)}
                    className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                      activeFilter === filter
                        ? "bg-blue-600 text-white"
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
          </div>

          <div className="divide-y divide-slate-100">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <article
                  key={job.id}
                  className="p-4 transition hover:bg-slate-50/70 sm:p-6"
                >
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex min-w-0 gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                        <BriefcaseBusiness size={21} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-slate-900">
                            {job.title}
                          </h3>

                          <StatusBadge status={job.status} />
                        </div>

                        <p className="mt-1 text-sm text-slate-500">
                          {job.department} · {job.type} · {job.workplace}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin size={14} />
                            {job.location}
                          </span>

                          <span className="inline-flex items-center gap-1.5">
                            <Users size={14} />
                            {job.applicants || 0} applicants
                          </span>

                          <span>
                            {job.experience || "Experience not specified"}
                          </span>

                          <span>Posted {formatDate(job.posted)}</span>
                        </div>

                        {(job.salaryMin || job.salaryMax) && (
                          <p className="mt-3 text-sm font-semibold text-slate-800">
                            ₹{job.salaryMin || "—"}–{job.salaryMax || "—"} LPA
                          </p>
                        )}

                        {job.description && (
                          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
                            {job.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-2 xl:justify-end">
                      <button
                        type="button"
                        onClick={() => openEditModal(job)}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                      >
                        <Edit3 size={15} />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleJobStatus(job.id)}
                        className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl border px-3.5 text-sm font-semibold transition ${
                          job.status === "Active"
                            ? "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                            : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        }`}
                      >
                        {job.status === "Active" ? (
                          <>
                            <XCircle size={15} />
                            Close job
                          </>
                        ) : (
                          <>
                            <CheckCircle2 size={15} />
                            Reopen job
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteJob(job.id)}
                        aria-label={`Delete ${job.title}`}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-red-100 bg-white text-red-600 transition hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="px-5 py-16 text-center">
                <BriefcaseBusiness
                  size={30}
                  className="mx-auto text-slate-300"
                />

                <h3 className="mt-4 font-bold text-slate-900">
                  No job listings found
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Try another search or create a new job posting.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setActiveFilter("All");
                    setSearchQuery("");
                  }}
                  className="mt-4 text-sm font-semibold text-blue-700 hover:text-blue-800"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </section>

        <p className="mt-4 text-xs leading-5 text-slate-400">
          Demo data is stored in this browser's localStorage. Job
          postings are not yet connected to the backend API.
        </p>
      </div>

      {/* Create and edit job modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3 backdrop-blur-sm sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setModalOpen(false);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="job-modal-title"
            className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between border-b border-slate-100 p-5 sm:p-6">
              <div>
                <h2
                  id="job-modal-title"
                  className="text-xl font-bold text-slate-900"
                >
                  {editingJobId !== null
                    ? "Edit job posting"
                    : "Post a new job"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Enter the job details below.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="Close modal"
                className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="overflow-y-auto">
              <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
                <div className="sm:col-span-2">
                  <FormField label="Job title *">
                    <input
                      name="title"
                      value={form.title}
                      onChange={updateField}
                      placeholder="e.g. Backend Developer"
                      className={inputClass}
                      required
                    />
                  </FormField>
                </div>

                <FormField label="Department">
                  <select
                    name="department"
                    value={form.department}
                    onChange={updateField}
                    className={inputClass}
                  >
                    <option>Engineering</option>
                    <option>Design & Engineering</option>
                    <option>Product</option>
                    <option>Marketing</option>
                    <option>Sales</option>
                    <option>Human Resources</option>
                    <option>Finance</option>
                    <option>Other</option>
                  </select>
                </FormField>

                <FormField label="Employment type">
                  <select
                    name="type"
                    value={form.type}
                    onChange={updateField}
                    className={inputClass}
                  >
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Internship</option>
                    <option>Freelance</option>
                  </select>
                </FormField>

                <div className="sm:col-span-2">
                  <FormField label="Job location *">
                    <input
                      name="location"
                      value={form.location}
                      onChange={updateField}
                      placeholder="e.g. Gurugram, Haryana or Remote"
                      className={inputClass}
                      required
                    />
                  </FormField>
                </div>

                <FormField label="Workplace">
                  <select
                    name="workplace"
                    value={form.workplace}
                    onChange={updateField}
                    className={inputClass}
                  >
                    <option>On-site</option>
                    <option>Hybrid</option>
                    <option>Remote</option>
                  </select>
                </FormField>

                <FormField label="Experience required">
                  <select
                    name="experience"
                    value={form.experience}
                    onChange={updateField}
                    className={inputClass}
                  >
                    <option>Fresher</option>
                    <option>0–2 years</option>
                    <option>1–3 years</option>
                    <option>3–5 years</option>
                    <option>5+ years</option>
                  </select>
                </FormField>

                <FormField label="Minimum salary (LPA)">
                  <input
                    name="salaryMin"
                    type="number"
                    min="0"
                    step="0.1"
                    value={form.salaryMin}
                    onChange={updateField}
                    placeholder="e.g. 4"
                    className={inputClass}
                  />
                </FormField>

                <FormField label="Maximum salary (LPA)">
                  <input
                    name="salaryMax"
                    type="number"
                    min="0"
                    step="0.1"
                    value={form.salaryMax}
                    onChange={updateField}
                    placeholder="e.g. 8"
                    className={inputClass}
                  />
                </FormField>

                <FormField label="Number of openings">
                  <input
                    name="openings"
                    type="number"
                    min="1"
                    step="1"
                    value={form.openings}
                    onChange={updateField}
                    className={inputClass}
                    required
                  />
                </FormField>

                <div className="sm:col-span-2">
                  <FormField label="Job description *">
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={updateField}
                      placeholder="Describe responsibilities, required skills and qualifications..."
                      rows={5}
                      className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                      required
                    />
                  </FormField>
                </div>

                {formError && (
                  <p
                    role="alert"
                    className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 sm:col-span-2"
                  >
                    {formError}
                  </p>
                )}
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/70 p-5 sm:flex-row sm:justify-end sm:px-6">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  <Plus size={16} />
                  {editingJobId !== null ? "Save changes" : "Publish job"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
