import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bookmark,
  BriefcaseBusiness,
  Building2,
  Clock3,
  MapPin,
  Search,
  Trash2,
  Wallet,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  getSavedJobs,
  saveSavedJobs,
  subscribeToSeekerData,
} from "../../data/seekerStorage";

export default function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState(getSavedJobs);
  const [search, setSearch] = useState("");

  // Keep this page synchronized with the shared seeker storage.
  useEffect(() => {
    return subscribeToSeekerData(() => {
      setSavedJobs(getSavedJobs());
    });
  }, []);

  const removeJob = (id) => {
    const updatedJobs = getSavedJobs().filter((job) => job.id !== id);

    saveSavedJobs(updatedJobs);
    setSavedJobs(updatedJobs);
    toast.success("Job removed from saved jobs");
  };

  const filteredJobs = savedJobs.filter((job) => {
    const query = search.toLowerCase();

    return (
      job.title.toLowerCase().includes(query) ||
      job.company.toLowerCase().includes(query) ||
      job.location.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-600">
                Job Seeker
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                Saved Jobs
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Keep track of the opportunities you want to apply for.
              </p>
            </div>

            <Link
              to="/jobs"
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <Search size={16} />
              Find More Jobs
            </Link>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Bookmark size={19} />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Saved Jobs
                </p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {savedJobs.length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <BriefcaseBusiness size={19} />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Full-time
                </p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {savedJobs.filter((job) => job.type === "Full-time").length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <MapPin size={19} />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Remote
                </p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {savedJobs.filter((job) => job.location === "Remote").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search your saved jobs..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
            />
          </div>
        </div>

        {/* Jobs */}
        {filteredJobs.length > 0 ? (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <article
                key={job.id}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  {/* Job Info */}
                  <div className="flex min-w-0 gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-600">
                      {job.logo}
                    </div>

                    <div className="min-w-0">
                      <Link
                        to={`/jobs/${job.id}`}
                        className="text-lg font-bold text-slate-900 transition hover:text-blue-600"
                      >
                        {job.title}
                      </Link>

                      <div className="mt-1 flex items-center gap-2 text-sm font-medium text-slate-600">
                        <Building2 size={15} />
                        {job.company}
                      </div>

                      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <MapPin size={15} />
                          {job.location}
                        </span>

                        <span className="flex items-center gap-1.5">
                          <BriefcaseBusiness size={15} />
                          {job.type}
                        </span>

                        <span className="flex items-center gap-1.5">
                          <Wallet size={15} />
                          {job.salary}
                        </span>

                        <span className="flex items-center gap-1.5">
                          <Clock3 size={15} />
                          {job.posted}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 items-center gap-2">
                    <Link
                      to={`/jobs/${job.id}`}
                      className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-center text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 sm:flex-none"
                    >
                      View Job
                    </Link>

                    <button
                      type="button"
                      onClick={() => removeJob(job.id)}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                      title="Remove saved job"
                      aria-label={`Remove ${job.title} from saved jobs`}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Bookmark size={24} />
            </div>

            <h2 className="mt-4 text-lg font-bold text-slate-900">
              No saved jobs found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              {search
                ? "Try a different search term."
                : "Save interesting jobs and they will appear here."}
            </p>

            {!search && (
              <Link
                to="/jobs"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <Search size={16} />
                Explore Jobs
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
