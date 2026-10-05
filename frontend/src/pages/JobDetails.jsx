import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Bookmark,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Clock3,
  MapPin,
  Users,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { getJobById } from "../services/jobService";

function formatEmploymentType(type) {
  if (!type) {
    return "Not specified";
  }

  return type
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatExperienceLevel(level) {
  if (!level) {
    return "Not specified";
  }

  return level
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatWorkplaceType(type) {
  if (!type) {
    return "Not specified";
  }

  return type
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatSalary(min, max) {
  if (min == null && max == null) {
    return "Salary not disclosed";
  }

  const formatAmount = (amount) => {
    if (amount == null) {
      return "";
    }

    return `₹${Number(amount).toLocaleString("en-IN")}`;
  };

  if (min != null && max != null) {
    return `${formatAmount(min)} - ${formatAmount(max)}`;
  }

  if (min != null) {
    return `From ${formatAmount(min)}`;
  }

  return `Up to ${formatAmount(max)}`;
}

function formatDate(date) {
  if (!date) {
    return "Not specified";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not specified";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function JobDetails() {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
   * Fetch job details from backend.
   */
  useEffect(() => {
    let isMounted = true;

    const fetchJob = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getJobById(id);

        if (!isMounted) {
          return;
        }

        setJob(response?.data || null);
      } catch (err) {
        if (!isMounted) {
          return;
        }

        const message =
          err?.response?.data?.message ||
          "Unable to load this job.";

        setError(message);
        setJob(null);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (id) {
      fetchJob();
    } else {
      setLoading(false);
      setError("Invalid job ID.");
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  /*
   * Loading state.
   */
  if (loading) {
    return (
      <main className="min-h-screen bg-[#f6f8fb]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#0066b3]"
          >
            <ArrowLeft size={17} />
            Back to jobs
          </Link>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
            <section>
              <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
                <div className="flex gap-5">
                  <div className="h-16 w-16 shrink-0 rounded-2xl bg-slate-200" />

                  <div className="flex-1">
                    <div className="h-8 w-2/3 rounded bg-slate-200" />

                    <div className="mt-3 h-4 w-1/3 rounded bg-slate-200" />

                    <div className="mt-5 h-4 w-2/3 rounded bg-slate-100" />
                  </div>
                </div>

                <div className="mt-7 h-20 rounded bg-slate-100" />
              </div>

              <div className="mt-5 animate-pulse rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
                <div className="h-6 w-48 rounded bg-slate-200" />

                <div className="mt-5 space-y-3">
                  <div className="h-4 w-full rounded bg-slate-100" />
                  <div className="h-4 w-full rounded bg-slate-100" />
                  <div className="h-4 w-4/5 rounded bg-slate-100" />
                </div>
              </div>
            </section>

            <aside className="lg:sticky lg:top-24 lg:h-fit">
              <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6">
                <div className="h-4 w-28 rounded bg-slate-200" />

                <div className="mt-3 h-7 w-48 rounded bg-slate-200" />

                <div className="my-6 h-px bg-slate-100" />

                <div className="space-y-5">
                  <div className="h-4 rounded bg-slate-100" />
                  <div className="h-4 rounded bg-slate-100" />
                  <div className="h-4 rounded bg-slate-100" />
                </div>

                <div className="mt-6 h-12 rounded-xl bg-slate-200" />
              </div>
            </aside>
          </div>
        </div>
      </main>
    );
  }

  /*
   * Error / not found state.
   */
  if (error || !job) {
    return (
      <main className="min-h-screen bg-[#f6f8fb]">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center">
          <div className="rounded-2xl border border-slate-200 bg-white p-10">
            <h1 className="text-2xl font-black text-[#172b4d]">
              Job not found
            </h1>

            <p className="mt-3 text-sm text-slate-500">
              {error ||
                "The job you are looking for is no longer available."}
            </p>

            <Link
              to="/jobs"
              className="mt-5 inline-flex rounded-xl bg-[#0066b3] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#005493]"
            >
              Browse Jobs
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const jobId = job._id || job.id;

  const skills = Array.isArray(job.skills) ? job.skills : [];

  const requirements = Array.isArray(job.requirements)
    ? job.requirements
    : [];

  const companyName =
    job.companyName ||
    job.company?.name ||
    "Company not specified";

  const companyId =
    typeof job.company === "object"
      ? job.company?._id
      : job.company;

  const handleApply = () => {
    toast.success("Application started");
  };

  return (
    <main className="min-h-screen bg-[#f6f8fb]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* =======================================================
            BACK LINK
            ======================================================= */}

        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#0066b3]"
        >
          <ArrowLeft size={17} />
          Back to jobs
        </Link>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* =====================================================
              MAIN CONTENT
              ===================================================== */}

          <section>
            {/* Job header */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-[#0066b3]">
                  <Building2 size={28} />
                </div>

                <div className="min-w-0">
                  <h1 className="text-2xl font-black text-[#172b4d] sm:text-3xl">
                    {job.title}
                  </h1>

                  {companyId ? (
                    <Link
                      to={`/companies/${companyId}`}
                      className="mt-2 inline-block font-bold text-slate-500 transition hover:text-[#0066b3]"
                    >
                      {companyName}
                    </Link>
                  ) : (
                    <p className="mt-2 font-bold text-slate-500">
                      {companyName}
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <MapPin size={16} />
                      {job.location || "Location not specified"}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <BriefcaseBusiness size={16} />
                      {formatExperienceLevel(
                        job.experienceLevel,
                      )}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <Clock3 size={16} />
                      {formatEmploymentType(
                        job.employmentType,
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Skills */}

              {skills.length > 0 && (
                <div className="mt-7 flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span
                      key={`${skill}-${index}`}
                      className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-[#0066b3]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* ===================================================
                DESCRIPTION
                =================================================== */}

            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
              <h2 className="text-xl font-black text-[#172b4d]">
                Job Description
              </h2>

              <p className="mt-4 whitespace-pre-line leading-8 text-slate-600">
                {job.description ||
                  "No job description has been provided."}
              </p>

              {/* Requirements */}

              {requirements.length > 0 && (
                <>
                  <h3 className="mt-8 font-extrabold text-[#172b4d]">
                    Requirements
                  </h3>

                  <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                    {requirements.map((requirement, index) => (
                      <li
                        key={`${requirement}-${index}`}
                        className="flex gap-3"
                      >
                        <CheckCircle2
                          size={18}
                          className="mt-1 shrink-0 text-[#0066b3]"
                        />

                        <span>{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {/* Skills-based requirements fallback */}

              {requirements.length === 0 &&
                skills.length > 0 && (
                  <>
                    <h3 className="mt-8 font-extrabold text-[#172b4d]">
                      Requirements
                    </h3>

                    <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                      {skills.map((skill, index) => (
                        <li
                          key={`${skill}-${index}`}
                          className="flex gap-3"
                        >
                          <CheckCircle2
                            size={18}
                            className="mt-1 shrink-0 text-[#0066b3]"
                          />

                          <span>
                            Strong working knowledge of {skill}.
                          </span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
            </div>
          </section>

          {/* =====================================================
              SIDEBAR
              ===================================================== */}

          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Compensation
              </p>

              <p className="mt-2 text-xl font-black text-[#172b4d]">
                {formatSalary(
                  job.salaryMin,
                  job.salaryMax,
                )}
              </p>

              <div className="mt-6 space-y-4 border-y border-slate-100 py-5">
                {/* Job type */}

                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-slate-500">
                    Job type
                  </span>

                  <span className="text-right text-sm font-bold text-[#172b4d]">
                    {formatEmploymentType(
                      job.employmentType,
                    )}
                  </span>
                </div>

                {/* Work mode */}

                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-slate-500">
                    Work mode
                  </span>

                  <span className="text-right text-sm font-bold text-[#172b4d]">
                    {formatWorkplaceType(
                      job.workplaceType,
                    )}
                  </span>
                </div>

                {/* Experience */}

                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-slate-500">
                    Experience
                  </span>

                  <span className="text-right text-sm font-bold text-[#172b4d]">
                    {formatExperienceLevel(
                      job.experienceLevel,
                    )}
                  </span>
                </div>

                {/* Deadline */}

                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-slate-500">
                    Apply by
                  </span>

                  <span className="text-right text-sm font-bold text-[#172b4d]">
                    {formatDate(job.applicationDeadline)}
                  </span>
                </div>

                {/* Vacancies */}

                {job.vacancies != null && (
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-slate-500">
                      Vacancies
                    </span>

                    <span className="flex items-center gap-1 text-sm font-bold text-[#172b4d]">
                      <Users size={15} />
                      {job.vacancies}
                    </span>
                  </div>
                )}

                {/* Applicants */}

                {job.applicants != null && (
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-slate-500">
                      Applicants
                    </span>

                    <span className="text-sm font-bold text-[#172b4d]">
                      {job.applicants}
                    </span>
                  </div>
                )}
              </div>

              {/* Apply */}

              <button
                type="button"
                onClick={handleApply}
                className="mt-5 flex h-12 w-full items-center justify-center rounded-xl bg-[#0066b3] text-sm font-extrabold text-white transition hover:bg-[#005493]"
              >
                Apply Now
              </button>

              {/* Save */}

              <button
                type="button"
                onClick={() => toast.success("Job saved")}
                className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 text-sm font-extrabold text-[#172b4d] transition hover:border-blue-200 hover:text-[#0066b3]"
              >
                <Bookmark size={17} />
                Save Job
              </button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}