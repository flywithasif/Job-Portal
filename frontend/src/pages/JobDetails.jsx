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

import { jobs } from "../data/jobs";

export default function JobDetails() {
  const { id } = useParams();

  const job = jobs.find((item) => item.id === id);

  if (!job) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h1 className="text-2xl font-black text-[#172b4d]">
          Job not found
        </h1>

        <Link
          to="/jobs"
          className="mt-5 inline-flex rounded-xl bg-[#0066b3] px-5 py-3 text-sm font-bold text-white"
        >
          Browse Jobs
        </Link>
      </main>
    );
  }

  const handleApply = () => {
    toast.success("Application started");
  };

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
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-[#0066b3]">
                  <Building2 size={28} />
                </div>

                <div>
                  <h1 className="text-2xl font-black text-[#172b4d] sm:text-3xl">
                    {job.title}
                  </h1>

                  <p className="mt-2 font-bold text-slate-500">
                    {job.company}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <MapPin size={16} />
                      {job.location}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <BriefcaseBusiness size={16} />
                      {job.experience}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <Clock3 size={16} />
                      {job.type}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-7 flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-[#0066b3]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
              <h2 className="text-xl font-black text-[#172b4d]">
                Job Description
              </h2>

              <p className="mt-4 leading-8 text-slate-600">
                {job.description}
              </p>

              <h3 className="mt-8 font-extrabold text-[#172b4d]">
                Responsibilities
              </h3>

              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                {[
                  "Build scalable and maintainable software solutions.",
                  "Collaborate with product and engineering teams.",
                  "Write clean, tested and production-ready code.",
                  "Participate in code reviews and technical discussions.",
                  "Monitor application performance and reliability.",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <CheckCircle2
                      size={18}
                      className="mt-1 shrink-0 text-emerald-500"
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <h3 className="mt-8 font-extrabold text-[#172b4d]">
                Requirements
              </h3>

              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
                {job.skills.map((skill) => (
                  <li key={skill} className="flex gap-3">
                    <CheckCircle2
                      size={18}
                      className="mt-1 shrink-0 text-[#0066b3]"
                    />
                    Strong working knowledge of {skill}.
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Compensation
              </p>

              <p className="mt-2 text-xl font-black text-[#172b4d]">
                {job.salary}
              </p>

              <div className="mt-6 space-y-4 border-y border-slate-100 py-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Job type
                  </span>

                  <span className="text-sm font-bold text-[#172b4d]">
                    {job.type}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Work mode
                  </span>

                  <span className="text-sm font-bold text-[#172b4d]">
                    {job.workMode}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Vacancies
                  </span>

                  <span className="flex items-center gap-1 text-sm font-bold text-[#172b4d]">
                    <Users size={15} />
                    {job.vacancies}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Applicants
                  </span>

                  <span className="text-sm font-bold text-[#172b4d]">
                    {job.applicants}
                  </span>
                </div>
              </div>

              <button
                onClick={handleApply}
                className="mt-5 flex h-12 w-full items-center justify-center rounded-xl bg-[#0066b3] text-sm font-extrabold text-white transition hover:bg-[#005493]"
              >
                Apply Now
              </button>

              <button
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
