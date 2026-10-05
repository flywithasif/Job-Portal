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

  if (!value) {

    return "—";

  }



  const date = new Date(value);



  if (Number.isNaN(date.getTime())) {

    return "—";

  }



  return date.toLocaleDateString("en-IN", {

    day: "numeric",

    month: "short",

    year: "numeric",

  });

}



function formatEnum(value) {

  if (!value) {

    return "—";

  }



  return value

    .replaceAll("_", " ")

    .toLowerCase()

    .replace(/\b\w/g, (letter) => letter.toUpperCase());

}



function formatSalary(min, max) {

  if (min == null && max == null) {

    return null;

  }



  if (min != null && max != null) {

    return `₹${Number(min).toLocaleString("en-IN")}–₹${Number(

      max,

    ).toLocaleString("en-IN")}`;

  }



  if (min != null) {

    return `From ₹${Number(min).toLocaleString("en-IN")}`;

  }



  return `Up to ₹${Number(max).toLocaleString("en-IN")}`;

}



function parseCommaSeparatedValues(value) {

  if (!value.trim()) {

    return [];

  }



  return value

    .split(",")

    .map((item) => item.trim())

    .filter(Boolean);

}



function normalizeJob(job) {

  return {

    ...job,

    id: job?._id || job?.id,

    status: job?.status === "CLOSED" ? "Closed" : "Active",

  };

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

      {active ? (

        <CheckCircle2 size={13} />

      ) : (

        <XCircle size={13} />

      )}



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

  const [jobs, setJobs] = useState([]);
  const [company, setCompany] = useState(null);
  const [companyLoading, setCompanyLoading] = useState(true);



  const [activeFilter, setActiveFilter] = useState("All");

  const [searchQuery, setSearchQuery] = useState("");



  const [modalOpen, setModalOpen] = useState(false);

  const [editingJobId, setEditingJobId] = useState(null);



  const [form, setForm] = useState({ ...emptyJob });



  const [formError, setFormError] = useState("");

  const [notice, setNotice] = useState("");



  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [actionId, setActionId] = useState(null);



  /*

   * Load recruiter jobs from backend.

   */

  const loadCompany = async () => {
    try {
      setCompanyLoading(true);
      const response = await getMyCompany();
      setCompany(response?.data?.company || null);
    } catch (error) {
      if (error?.response?.status === 404) {
        setCompany(null);
      } else {
        setCompany(null);
        toast.error(
          getApiErrorMessage(error, "Unable to load your company profile."),
        );
      }
    } finally {
      setCompanyLoading(false);
    }
  };

  const loadJobs = async () => {

    try {

      setLoading(true);



      const response = await getMyJobs({

        page: 1,

        limit: 100,

      });



      const backendJobs = Array.isArray(response?.data)

        ? response.data

        : [];



      setJobs(backendJobs.map(normalizeJob));

    } catch (error) {

      const message = getApiErrorMessage(

        error,

        "Unable to load your job postings.",

      );



      setJobs([]);

      toast.error(message);

    } finally {

      setLoading(false);

    }

  };



  useEffect(() => {

    loadJobs();

  }, []);



  /*

   * Automatically clear success messages.

   */

  useEffect(() => {

    if (!notice) {

      return undefined;

    }



    const timeoutId = window.setTimeout(() => {

      setNotice("");

    }, 3000);



    return () => window.clearTimeout(timeoutId);

  }, [notice]);



  /*

   * Statistics.

   */

  const stats = useMemo(

    () => ({

      total: jobs.length,



      active: jobs.filter((job) => job.status === "Active")

        .length,



      closed: jobs.filter((job) => job.status === "Closed")

        .length,



      applicants: jobs.reduce(

        (sum, job) => sum + (Number(job.applicants) || 0),

        0,

      ),

    }),

    [jobs],

  );



  /*

   * Search and status filtering.

   */

  const filteredJobs = useMemo(() => {

    const query = searchQuery.trim().toLowerCase();



    return jobs.filter((job) => {

      const matchesFilter =

        activeFilter === "All" ||

        job.status === activeFilter;



      const searchableValues = [

        job.title,

        job.companyName,

        job.location,

        job.employmentType,

        job.workplaceType,

        job.experienceLevel,

      ];



      const matchesSearch =

        !query ||

        searchableValues.some((value) =>

          String(value || "")

            .toLowerCase()

            .includes(query),

        );



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



  /*

   * Open create modal.

   */

  function openCreateModal() {

    setEditingJobId(null);

    setForm({ ...emptyJob });

    setFormError("");

    setModalOpen(true);

  }



  /*

   * Open edit modal.

   */

  function openEditModal(job) {

    setEditingJobId(job.id);



    setForm({

      title: job.title || "",

      location: job.location || "",

      employmentType:

        job.employmentType || "FULL_TIME",

      workplaceType: job.workplaceType || "HYBRID",

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



  /*

   * Submit create/update request.

   */

  async function handleSubmit(event) {

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



    if (form.title.trim().length < 2) {

      setFormError("Job title must contain at least 2 characters.");

      return;

    }



    if (form.description.trim().length < 20) {

      setFormError(

        "Job description must contain at least 20 characters.",

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



    if (

      form.applicationDeadline &&

      new Date(form.applicationDeadline) < new Date()

    ) {

      setFormError(

        "Application deadline cannot be in the past.",

      );



      return;

    }



    const skills = parseCommaSeparatedValues(form.skills);



    const requirements = form.requirements

      .split("\n")

      .map((item) => item.trim())

      .filter(Boolean);



    if (skills.length > 50) {

      setFormError("You can add a maximum of 50 skills.");

      return;

    }



    if (requirements.length > 30) {

      setFormError(

        "You can add a maximum of 30 requirements.",

      );



      return;

    }



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



        const updatedJob = normalizeJob(response?.data);



        setJobs((current) =>

          current.map((job) =>

            job.id === editingJobId

              ? updatedJob

              : job,

          ),

        );



        setNotice("Job posting updated successfully.");

        toast.success("Job updated successfully.");

      } else {

        const response = await createJob(payload);



        const createdJob = normalizeJob(response?.data);



        setJobs((current) => [createdJob, ...current]);



        setNotice("Job posting created successfully.");

        toast.success("Job published successfully.");

      }



      setModalOpen(false);

      setForm({ ...emptyJob });

      setEditingJobId(null);

    } catch (error) {

      const message = getApiErrorMessage(

        error,

        "Unable to save the job posting.",

      );



      setFormError(message);

      toast.error(message);

    } finally {

      setSubmitting(false);

    }

  }



  /*

   * Close/reopen job through backend.

   */

  async function toggleJobStatus(job) {

    const jobId = job.id;



    try {

      setActionId(jobId);



      const nextStatus =

        job.status === "Active" ? "CLOSED" : "OPEN";



      const response = await updateJob(jobId, {

        status: nextStatus,

      });



      const updatedJob = normalizeJob(response?.data);



      setJobs((current) =>

        current.map((item) =>

          item.id === jobId ? updatedJob : item,

        ),

      );



      const message =

        nextStatus === "OPEN"

          ? "Job reopened successfully."

          : "Job closed successfully.";



      setNotice(message);

      toast.success(message);

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



  /*

   * Delete job through backend.

   */

  async function handleDeleteJob(job) {

    const confirmed = window.confirm(

      `Are you sure you want to delete "${job.title}"?`,

    );



    if (!confirmed) {

      return;

    }



    try {

      setActionId(job.id);



      await deleteJob(job.id);



      setJobs((current) =>

        current.filter((item) => item.id !== job.id),

      );



      setNotice("Job posting deleted successfully.");

      toast.success("Job deleted successfully.");

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



  return (

    <main className="min-h-screen bg-slate-50 px-4 py-7 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-7xl">

        {/* =====================================================

            PAGE HEADER

            ===================================================== */}



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

              Create job listings, manage openings and track

              applicants.

            </p>

          </div>



          <button

            type="button"

            onClick={openCreateModal}

            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"

          >

            <Plus size={18} />

            Post a new job

          </button>

        </div>



        {/* =====================================================

            SUCCESS NOTICE

            ===================================================== */}



        {notice && (

          <div

            role="status"

            className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800"

          >

            {notice}

          </div>

        )}



        {/* =====================================================

            STATISTICS

            ===================================================== */}



        <section className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">

          {statCards.map((stat) => (

            <StatCard key={stat.label} {...stat} />

          ))}

        </section>



        {/* =====================================================

            JOB LISTINGS

            ===================================================== */}



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

                  onChange={(event) =>

                    setSearchQuery(event.target.value)

                  }

                  placeholder="Search jobs or location..."

                  className={`${inputClass} pl-10`}

                />

              </div>

            </div>



            <div className="mt-5 flex gap-2 overflow-x-auto pb-1">

              {filters.map((filter) => {

                const count =

                  filter === "All"

                    ? jobs.length

                    : jobs.filter(

                        (job) => job.status === filter,

                      ).length;



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



          {/* ===================================================

              LOADING

              =================================================== */}



          {loading ? (

            <div className="divide-y divide-slate-100">

              {[1, 2, 3].map((item) => (

                <div

                  key={item}

                  className="animate-pulse p-5 sm:p-6"

                >

                  <div className="flex gap-4">

                    <div className="h-12 w-12 rounded-xl bg-slate-200" />



                    <div className="flex-1">

                      <div className="h-5 w-1/3 rounded bg-slate-200" />

                      <div className="mt-3 h-4 w-1/2 rounded bg-slate-100" />

                      <div className="mt-3 h-4 w-2/3 rounded bg-slate-100" />

                    </div>

                  </div>

                </div>

              ))}

            </div>

          ) : filteredJobs.length > 0 ? (

            /* ===================================================

               JOB RESULTS

               =================================================== */



            <div className="divide-y divide-slate-100">

              {filteredJobs.map((job) => (

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

                          {job.companyName ||

                            "Company not specified"}{" "}

                          ·{" "}

                          {formatEnum(job.employmentType)} ·{" "}

                          {formatEnum(job.workplaceType)}

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

                            {formatEnum(

                              job.experienceLevel,

                            )}

                          </span>



                          <span>

                            Posted {formatDate(job.createdAt)}

                          </span>

                        </div>



                        {formatSalary(

                          job.salaryMin,

                          job.salaryMax,

                        ) && (

                          <p className="mt-3 text-sm font-semibold text-slate-800">

                            {formatSalary(

                              job.salaryMin,

                              job.salaryMax,

                            )}

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

                        disabled={actionId === job.id}

                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"

                      >

                        <Edit3 size={15} />

                        Edit

                      </button>



                      <button

                        type="button"

                        onClick={() => toggleJobStatus(job)}

                        disabled={actionId === job.id}

                        className={`inline-flex h-10 items-center justify-center gap-2 rounded-xl border px-3.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${

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

                        onClick={() => handleDeleteJob(job)}

                        disabled={actionId === job.id}

                        aria-label={`Delete ${job.title}`}

                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-red-100 bg-white text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"

                      >

                        <Trash2 size={16} />

                      </button>

                    </div>

                  </div>

                </article>

              ))}

            </div>

          ) : (

            /* ===================================================

               EMPTY STATE

               =================================================== */



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

        </section>



        <p className="mt-4 text-xs leading-5 text-slate-400">

          Job postings are now connected to the backend API and

          stored in MongoDB.

        </p>

      </div>



      {/* =========================================================

          CREATE / EDIT MODAL

          ========================================================= */}



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

            {/* Modal header */}



            <div className="flex items-start justify-between border-b border-slate-100 p-5 sm:p-6">

              <div>

                <h2

                  id="job-modal-title"

                  className="text-xl font-bold text-slate-900"

                >

                  {editingJobId

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



            {/* Modal form */}



            <form

              onSubmit={handleSubmit}

              className="overflow-y-auto"

            >

              <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">

                {/* Job title */}



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

                {/* Company */}

                <div className="sm:col-span-2">
                  <FormField label="Company">
                    {companyLoading ? (
                      <div className="flex h-11 items-center rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-400">
                        Loading company profile...
                      </div>
                    ) : company?._id ? (
                      <div className="rounded-xl border border-blue-100 bg-blue-50/60 px-3.5 py-3">
                        <p className="text-sm font-semibold text-slate-900">
                          {company.name}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          This company will be automatically attached to the job.
                        </p>
                      </div>
                    ) : (
                      <div className="rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-sm text-amber-800">
                        Company profile not found. Please create your company
                        profile before posting a job.
                      </div>
                    )}
                  </FormField>
                </div>

                {/* Employment type */}



                <FormField label="Employment type">

                  <select

                    name="employmentType"

                    value={form.employmentType}

                    onChange={updateField}

                    className={inputClass}

                  >

                    <option value="FULL_TIME">

                      Full Time

                    </option>



                    <option value="PART_TIME">

                      Part Time

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

                </FormField>



                {/* Workplace */}



                <FormField label="Workplace">

                  <select

                    name="workplaceType"

                    value={form.workplaceType}

                    onChange={updateField}

                    className={inputClass}

                  >

                    <option value="ONSITE">On-site</option>

                    <option value="HYBRID">Hybrid</option>

                    <option value="REMOTE">Remote</option>

                  </select>

                </FormField>



                {/* Location */}



                <div className="sm:col-span-2">

                  <FormField label="Job location *">

                    <input

                      name="location"

                      value={form.location}

                      onChange={updateField}

                      placeholder="e.g. Gurugram, Haryana"

                      className={inputClass}

                      required

                    />

                  </FormField>

                </div>



                {/* Experience */}



                <FormField label="Experience required">

                  <select

                    name="experienceLevel"

                    value={form.experienceLevel}

                    onChange={updateField}

                    className={inputClass}

                  >

                    <option value="FRESHER">Fresher</option>

                    <option value="ENTRY_LEVEL">

                      Entry Level

                    </option>

                    <option value="MID_LEVEL">

                      Mid Level

                    </option>

                    <option value="SENIOR">

                      Senior

                    </option>

                  </select>

                </FormField>



                {/* Deadline */}



                <FormField label="Application deadline">

                  <input

                    name="applicationDeadline"

                    type="date"

                    value={form.applicationDeadline}

                    onChange={updateField}

                    min={new Date()

                      .toISOString()

                      .slice(0, 10)}

                    className={inputClass}

                  />

                </FormField>



                {/* Minimum salary */}



                <FormField label="Minimum salary">

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



                {/* Maximum salary */}



                <FormField label="Maximum salary">

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



                {/* Skills */}



                <div className="sm:col-span-2">

                  <FormField label="Skills">

                    <input

                      name="skills"

                      value={form.skills}

                      onChange={updateField}

                      placeholder="Node.js, Express, MongoDB, React"

                      className={inputClass}

                    />



                    <p className="mt-1.5 text-xs text-slate-400">

                      Separate skills with commas.

                    </p>

                  </FormField>

                </div>



                {/* Requirements */}



                <div className="sm:col-span-2">

                  <FormField label="Requirements">

                    <textarea

                      name="requirements"

                      value={form.requirements}

                      onChange={updateField}

                      placeholder={`2+ years of backend development

Strong knowledge of Node.js

Experience with MongoDB`}

                      rows={4}

                      className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"

                    />



                    <p className="mt-1.5 text-xs text-slate-400">

                      Write one requirement per line.

                    </p>

                  </FormField>

                </div>



                {/* Description */}



                <div className="sm:col-span-2">

                  <FormField label="Job description *">

                    <textarea

                      name="description"

                      value={form.description}

                      onChange={updateField}

                      placeholder="Describe responsibilities, required skills and qualifications..."

                      rows={6}

                      className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"

                      required

                    />

                  </FormField>

                </div>



                {/* Error */}



                {formError && (

                  <p

                    role="alert"

                    className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 sm:col-span-2"

                  >

                    {formError}

                  </p>

                )}

              </div>



              {/* Modal footer */}



              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/70 p-5 sm:flex-row sm:justify-end sm:px-6">

                <button

                  type="button"

                  onClick={() => setModalOpen(false)}

                  disabled={submitting}

                  className="h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"

                >

                  Cancel

                </button>



                <button

                  type="submit"

                  disabled={submitting}

                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"

                >

                  <Plus size={16} />



                  {submitting

                    ? "Saving..."

                    : editingJobId

                      ? "Save changes"

                      : "Publish job"}

                </button>

              </div>

            </form>

          </section>

        </div>

      )}

    </main>

  );

}