import { Search, SlidersHorizontal } from "lucide-react";

export default function JobFilters({
  filters,
  setFilters,
}) {
  const updateFilter = (key, value) => {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }));
  };

  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-[#172b4d]">
          Filters
        </h3>

        <SlidersHorizontal
          size={18}
          className="text-[#0066b3]"
        />
      </div>

      <div className="mt-6">
        <label className="text-xs font-bold uppercase tracking-wide text-slate-400">
          Search
        </label>

        <div className="relative mt-2">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={filters.search}
            onChange={(event) =>
              updateFilter("search", event.target.value)
            }
            placeholder="Job title or skill"
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none transition focus:border-[#0066b3] focus:bg-white"
          />
        </div>
      </div>

      <div className="mt-6">
        <label className="text-xs font-bold uppercase tracking-wide text-slate-400">
          Location
        </label>

        <input
          value={filters.location}
          onChange={(event) =>
            updateFilter("location", event.target.value)
          }
          placeholder="e.g. Gurgaon"
          className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-[#0066b3] focus:bg-white"
        />
      </div>

      <div className="mt-6">
        <label className="text-xs font-bold uppercase tracking-wide text-slate-400">
          Job Type
        </label>

        <select
          value={filters.type}
          onChange={(event) =>
            updateFilter("type", event.target.value)
          }
          className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-[#0066b3] focus:bg-white"
        >
          <option value="">All Types</option>
          <option value="Full Time">Full Time</option>
          <option value="Internship">Internship</option>
          <option value="Part Time">Part Time</option>
        </select>
      </div>

      <div className="mt-6">
        <label className="text-xs font-bold uppercase tracking-wide text-slate-400">
          Work Mode
        </label>

        <select
          value={filters.workMode}
          onChange={(event) =>
            updateFilter("workMode", event.target.value)
          }
          className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-[#0066b3] focus:bg-white"
        >
          <option value="">All Modes</option>
          <option value="Remote">Remote</option>
          <option value="Hybrid">Hybrid</option>
          <option value="On-site">On-site</option>
        </select>
      </div>
    </aside>
  );
}
