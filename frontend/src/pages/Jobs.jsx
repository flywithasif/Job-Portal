import { useMemo, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import { jobs } from "../data/jobs";
import JobCard from "../components/JobCard";
import JobFilters from "../components/JobFilters";

export default function Jobs() {
  const [searchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    location: searchParams.get("location") || "",
    type: "",
    workMode: "",
  });

  const [sort, setSort] = useState("newest");

  const filteredJobs = useMemo(() => {
    const search = filters.search.toLowerCase();
    const location = filters.location.toLowerCase();

    let result = jobs.filter((job) => {
      const searchableText = [
        job.title,
        job.company,
        ...job.skills,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !search || searchableText.includes(search);

      const matchesLocation =
        !location ||
        job.location.toLowerCase().includes(location);

      const matchesType =
        !filters.type || job.type === filters.type;

      const matchesMode =
        !filters.workMode ||
        job.workMode === filters.workMode;

      return (
        matchesSearch &&
        matchesLocation &&
        matchesType &&
        matchesMode
      );
    });

    if (sort === "salary") {
      result = [...result].sort((a, b) =>
        b.salary.localeCompare(a.salary),
      );
    }

    return result;
  }, [filters, sort]);

  return (
    <main className="min-h-screen bg-[#f6f8fb]">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#0066b3]">
            Opportunities
          </p>

          <h1 className="mt-2 text-3xl font-black text-[#172b4d]">
            Find your next job
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Search thousands of opportunities from growing companies.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <JobFilters
            filters={filters}
            setFilters={setFilters}
          />

          <section>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-bold text-[#172b4d]">
                  {filteredJobs.length} jobs found
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Updated recently
                </p>
              </div>

              <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3">
                <span className="text-xs font-bold text-slate-400">
                  Sort
                </span>

                <ChevronDown size={15} />

                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  className="h-10 bg-transparent text-sm font-semibold outline-none"
                >
                  <option value="newest">Newest</option>
                  <option value="salary">Salary</option>
                </select>
              </label>
            </div>

            {filteredJobs.length > 0 ? (
              <div className="grid gap-4">
                {filteredJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
                <Search
                  className="mx-auto text-slate-300"
                  size={38}
                />

                <h2 className="mt-4 font-extrabold text-[#172b4d]">
                  No jobs found
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Try changing your search or filters.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
