import {
  Bookmark,
  BriefcaseBusiness,
  Clock3,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

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

function formatPostedDate(date) {
  if (!date) {
    return "Recently posted";
  }

  const createdAt = new Date(date);

  if (Number.isNaN(createdAt.getTime())) {
    return "Recently posted";
  }

  const now = new Date();
  const difference = now.getTime() - createdAt.getTime();

  const minutes = Math.floor(difference / (1000 * 60));
  const hours = Math.floor(difference / (1000 * 60 * 60));
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  if (hours < 24) {
    return `${hours}h ago`;
  }

  if (days < 7) {
    return `${days}d ago`;
  }

  return createdAt.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function JobCard({ job }) {
  const jobId = job?._id || job?.id;

  const handleSave = () => {
    toast.success("Job saved");
  };

  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-5 transition duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_15px_40px_rgba(15,60,100,0.08)]">
      {/* =========================================================
          HEADER
          ========================================================= */}

      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0066b3]">
            <BriefcaseBusiness size={21} />
          </div>

          <div className="min-w-0">
            <Link
              to={`/jobs/${jobId}`}
              className="line-clamp-1 text-base font-extrabold text-[#172b4d] transition hover:text-[#0066b3]"
            >
              {job?.title || "Untitled Job"}
            </Link>

            <p className="mt-1 text-sm font-semibold text-slate-500">
              {job?.companyName || "Company not specified"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="rounded-lg p-2 text-slate-400 transition hover:bg-blue-50 hover:text-[#0066b3]"
          aria-label="Save job"
        >
          <Bookmark size={19} />
        </button>
      </div>

      {/* =========================================================
          JOB META
          ========================================================= */}

      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-sm text-slate-500">
        <span className="flex items-center gap-1.5">
          <MapPin size={15} />
          {job?.location || "Location not specified"}
        </span>

        <span className="flex items-center gap-1.5">
          <BriefcaseBusiness size={15} />
          {formatExperienceLevel(job?.experienceLevel)}
        </span>

        <span className="flex items-center gap-1.5">
          <Clock3 size={15} />
          {formatEmploymentType(job?.employmentType)}
        </span>
      </div>

      {/* =========================================================
          SALARY + POSTED DATE
          ========================================================= */}

      <div className="mt-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-[#172b4d]">
            {formatSalary(job?.salaryMin, job?.salaryMax)}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {formatPostedDate(job?.createdAt)}
          </p>
        </div>

        <Link
          to={`/jobs/${jobId}`}
          className="rounded-xl bg-[#0066b3] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#005493]"
        >
          View Job
        </Link>
      </div>

      {/* =========================================================
          SKILLS
          ========================================================= */}

      {Array.isArray(job?.skills) && job.skills.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {job.skills.slice(0, 3).map((skill, index) => (
            <span
              key={`${skill}-${index}`}
              className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600"
            >
              {skill}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}