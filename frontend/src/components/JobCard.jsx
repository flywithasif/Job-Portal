import {
  Bookmark,
  BriefcaseBusiness,
  Clock3,
  MapPin,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

export default function JobCard({ job }) {
  const location = useLocation();

  const isDashboardJobs = location.pathname.startsWith("/dashboard/jobs");
  const jobId = job?._id || job?.id;
  const jobPath = isDashboardJobs
    ? `/dashboard/jobs/${jobId}`
    : `/jobs/${jobId}`;

  const handleSave = () => {
    toast.success("Job saved");
  };

  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-5 transition duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_15px_40px_rgba(15,60,100,0.08)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0066b3]">
            <BriefcaseBusiness size={21} />
          </div>

          <div className="min-w-0">
            <Link
              to={jobPath}
              className="line-clamp-1 text-base font-extrabold text-[#172b4d] transition hover:text-[#0066b3]"
            >
              {job?.title || "Untitled Job"}
            </Link>

            <p className="mt-1 text-sm font-semibold text-slate-500">
              {job?.company?.name || job?.companyName || job?.company || "Company"}
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

      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-sm text-slate-500">
        <span className="flex items-center gap-1.5">
          <MapPin size={15} />
          {job?.location || "Location not specified"}
        </span>

        <span className="flex items-center gap-1.5">
          <BriefcaseBusiness size={15} />
          {job?.experience || job?.experienceLevel || "Experience not specified"}
        </span>

        <span className="flex items-center gap-1.5">
          <Clock3 size={15} />
          {job?.employmentType || job?.type || "Full Time"}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-[#172b4d]">
            {job?.salary || "Salary not disclosed"}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {job?.posted || "Recently posted"}
          </p>
        </div>

        <Link
          to={jobPath}
          className="rounded-xl bg-[#0066b3] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#005493]"
        >
          View Job
        </Link>
      </div>

      {Array.isArray(job?.skills) && job.skills.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {job.skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
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
