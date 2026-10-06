import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronRight,
  Globe2,
  MapPin,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getCompanies } from "../../services/companyService";

const getCompanyName = (company) =>
  company?.name ||
  company?.companyName ||
  company?.title ||
  "Company";

const getCompanyLocation = (company) =>
  company?.location ||
  company?.city ||
  company?.headquarters ||
  "Location not specified";

const getCompanyIndustry = (company) =>
  company?.industry ||
  company?.category ||
  "Technology & Services";

const getCompanyDescription = (company) =>
  company?.description ||
  "Discover this company, explore its work culture, and find opportunities that match your career goals.";

const getCompanyJobsCount = (company) =>
  company?.jobCount ??
  company?.jobsCount ??
  company?.openJobsCount ??
  (Array.isArray(company?.jobs) ? company.jobs.length : 0);

const getCompanyWebsite = (company) =>
  company?.website ||
  company?.websiteUrl ||
  company?.url ||
  "";

const getCompanySize = (company) =>
  company?.companySize ||
  company?.size ||
  company?.employees ||
  "";

const getInitials = (name) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");

const isValidImage = (src) => {
  if (!src || typeof src !== "string") {
    return false;
  }

  return (
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.startsWith("/")
  );
};

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadCompanies = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getCompanies({
          page: 1,
          limit: 100,
        });

        const companyData = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.companies)
            ? response.companies
            : Array.isArray(response)
              ? response
              : [];

        if (mounted) {
          setCompanies(companyData);
        }
      } catch (err) {
        console.error("Failed to load companies:", err);

        if (mounted) {
          setError(
            err?.response?.data?.message ||
              "Unable to load companies right now.",
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadCompanies();

    return () => {
      mounted = false;
    };
  }, []);

  const industries = useMemo(() => {
    const uniqueIndustries = companies
      .map((company) => getCompanyIndustry(company))
      .filter(Boolean)
      .filter(
        (value, index, array) =>
          array.findIndex(
            (item) => item.toLowerCase() === value.toLowerCase(),
          ) === index,
      );

    return ["All", ...uniqueIndustries.slice(0, 8)];
  }, [companies]);

  const filteredCompanies = useMemo(() => {
    const query = search.trim().toLowerCase();

    return companies.filter((company) => {
      const name = getCompanyName(company).toLowerCase();
      const location = getCompanyLocation(company).toLowerCase();
      const companyIndustry = getCompanyIndustry(company).toLowerCase();
      const description = getCompanyDescription(company).toLowerCase();

      const matchesSearch =
        !query ||
        name.includes(query) ||
        location.includes(query) ||
        companyIndustry.includes(query) ||
        description.includes(query);

      const matchesIndustry =
        industry === "All" ||
        companyIndustry === industry.toLowerCase();

      return matchesSearch && matchesIndustry;
    });
  }, [companies, industry, search]);

  const totalJobs = useMemo(
    () =>
      companies.reduce(
        (total, company) => total + Number(getCompanyJobsCount(company) || 0),
        0,
      ),
    [companies],
  );

  const featuredCompanies = useMemo(
    () =>
      [...companies]
        .sort(
          (a, b) =>
            Number(getCompanyJobsCount(b) || 0) -
            Number(getCompanyJobsCount(a) || 0),
        )
        .slice(0, 3),
    [companies],
  );

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-slate-900">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-[#07111f]">
        <div className="absolute -left-32 top-0 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-16 lg:px-8 lg:pb-24 lg:pt-20">
          <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-300 backdrop-blur">
                <Sparkles size={14} />
                Discover great companies
              </div>

              <h1 className="max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                Find a company where your{" "}
                <span className="text-blue-400">career can grow.</span>
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                Explore companies, discover their opportunities, and find a
                workplace that matches your skills, ambitions, and career
                goals.
              </p>

              <div className="mt-9 max-w-2xl">
                <div className="flex flex-col rounded-2xl border border-white/10 bg-white p-2 shadow-2xl shadow-black/20 sm:flex-row">
                  <div className="relative flex-1">
                    <Search
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="text"
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder="Search companies, industries or locations..."
                      className="h-12 w-full bg-transparent pl-12 pr-4 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                    />
                  </div>

                  <button
                    type="button"
                    className="mt-2 flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-bold text-white transition hover:bg-blue-700 sm:mt-0"
                    onClick={() => {
                      document
                        .getElementById("company-directory")
                        ?.scrollIntoView({
                          behavior: "smooth",
                        });
                    }}
                  >
                    Explore
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-8">
                <div>
                  <p className="text-2xl font-black text-white">
                    {companies.length}+
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-400">
                    Companies
                  </p>
                </div>

                <div className="h-10 w-px bg-white/10" />

                <div>
                  <p className="text-2xl font-black text-white">
                    {totalJobs}+
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-400">
                    Open positions
                  </p>
                </div>

                <div className="h-10 w-px bg-white/10" />

                <div>
                  <p className="text-2xl font-black text-white">
                    {industries.length > 1 ? industries.length - 1 : 0}+
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-400">
                    Industries
                  </p>
                </div>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="relative mx-auto max-w-md">
                <div className="absolute -inset-4 rounded-[2rem] bg-blue-500/10 blur-2xl" />

                <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur-xl">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                        Company directory
                      </p>
                      <p className="mt-1 text-lg font-bold text-white">
                        Top opportunities
                      </p>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
                      <Building2 size={19} />
                    </div>
                  </div>

                  <div className="space-y-3">
                    {featuredCompanies.length > 0
                      ? featuredCompanies.map((company) => {
                          const name = getCompanyName(company);
                          const jobs = getCompanyJobsCount(company);

                          return (
                            <div
                              key={company?._id || company?.id || name}
                              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                            >
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white text-sm font-black text-slate-900">
                                {isValidImage(company?.logo) ? (
                                  <img
                                    src={company.logo}
                                    alt={name}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  getInitials(name)
                                )}
                              </div>

                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-bold text-white">
                                  {name}
                                </p>
                                <p className="mt-1 text-xs text-slate-400">
                                  {jobs} open{" "}
                                  {jobs === 1 ? "position" : "positions"}
                                </p>
                              </div>

                              <CheckCircle2
                                size={17}
                                className="shrink-0 text-blue-400"
                              />
                            </div>
                          );
                        })
                      : [1, 2, 3].map((item) => (
                          <div
                            key={item}
                            className="h-[75px] animate-pulse rounded-2xl bg-white/5"
                          />
                        ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Directory */}
      <main
        id="company-directory"
        className="mx-auto max-w-7xl px-6 py-14 lg:px-8"
      >
        {/* Directory Header */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">
              Company directory
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Explore your next workplace
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
              Browse companies by industry, location, and available
              opportunities.
            </p>
          </div>

          {!loading && !error && (
            <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm">
              {filteredCompanies.length}{" "}
              {filteredCompanies.length === 1 ? "company" : "companies"} found
            </div>
          )}
        </div>

        {/* Filters */}
        {!loading && !error && companies.length > 0 && (
          <div className="mb-9 overflow-x-auto pb-2">
            <div className="flex min-w-max items-center gap-2">
              {industries.map((item) => {
                const active = industry === item;

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setIndustry(item)}
                    className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${
                      active
                        ? "bg-slate-900 text-white shadow-lg shadow-slate-900/10"
                        : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="animate-pulse">
                  <div className="flex justify-between">
                    <div className="h-14 w-14 rounded-2xl bg-slate-200" />
                    <div className="h-7 w-24 rounded-full bg-slate-200" />
                  </div>
                  <div className="mt-7 h-6 w-2/3 rounded bg-slate-200" />
                  <div className="mt-3 h-4 w-1/2 rounded bg-slate-200" />
                  <div className="mt-7 h-4 w-full rounded bg-slate-200" />
                  <div className="mt-2 h-4 w-5/6 rounded bg-slate-200" />
                  <div className="mt-8 h-px bg-slate-200" />
                  <div className="mt-5 h-10 rounded-xl bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-[2rem] border border-red-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <Building2 size={28} />
            </div>

            <h3 className="mt-6 text-xl font-black text-slate-900">
              Unable to load companies
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
              {error}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filteredCompanies.length === 0 && (
          <div className="rounded-[2rem] border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Search size={28} />
            </div>

            <h3 className="mt-6 text-xl font-black text-slate-900">
              No companies found
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
              We couldn't find a company matching your search. Try another
              keyword or clear the filters.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setIndustry("All");
              }}
              className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Company Cards */}
        {!loading && !error && filteredCompanies.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCompanies.map((company) => {
              const name = getCompanyName(company);
              const location = getCompanyLocation(company);
              const companyIndustry = getCompanyIndustry(company);
              const description = getCompanyDescription(company);
              const jobsCount = getCompanyJobsCount(company);
              const website = getCompanyWebsite(company);
              const size = getCompanySize(company);

              return (
                <article
                  key={company?._id || company?.id || name}
                  className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-2xl hover:shadow-slate-200/60"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-400 opacity-0 transition group-hover:opacity-100" />

                  <div className="p-7">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 text-lg font-black text-blue-600">
                        {isValidImage(company?.logo) ? (
                          <img
                            src={company.logo}
                            alt={name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          getInitials(name)
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[11px] font-black text-emerald-700">
                          <CheckCircle2 size={12} />
                          Verified
                        </span>
                      </div>
                    </div>

                    <div className="mt-7">
                      <h3 className="line-clamp-1 text-xl font-black tracking-tight text-slate-900">
                        {name}
                      </h3>

                      <div className="mt-3 flex items-center gap-2 text-sm font-medium text-slate-500">
                        <MapPin
                          size={16}
                          className="shrink-0 text-blue-500"
                        />
                        <span className="line-clamp-1">{location}</span>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                        {companyIndustry}
                      </span>

                      {size && (
                        <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                          {size}
                        </span>
                      )}
                    </div>

                    <p className="mt-5 line-clamp-3 min-h-[72px] text-sm leading-6 text-slate-500">
                      {description}
                    </p>

                    <div className="mt-7 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <div className="flex items-center gap-2">
                          <Users size={16} className="text-blue-500" />
                          <span className="text-xs font-bold text-slate-400">
                            Open roles
                          </span>
                        </div>

                        <p className="mt-2 text-lg font-black text-slate-900">
                          {jobsCount}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-4">
                        <div className="flex items-center gap-2">
                          <Globe2 size={16} className="text-blue-500" />
                          <span className="text-xs font-bold text-slate-400">
                            Website
                          </span>
                        </div>

                        <p className="mt-2 truncate text-sm font-black text-slate-900">
                          {website ? "Available" : "Not listed"}
                        </p>
                      </div>
                    </div>

                    <Link
                      to={`/companies/${company?._id || company?.id}`}
                      className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-black text-white transition hover:bg-blue-600"
                    >
                      View company
                      <ChevronRight
                        size={17}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* Bottom CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#07111f] px-7 py-12 shadow-2xl sm:px-12 lg:px-16">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-300">
                Your next move
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
                Find a role that takes your career further.
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-300">
                Explore open positions from growing companies and take the next
                step toward your professional goals.
              </p>
            </div>

            <Link
              to="/jobs"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-black text-white transition hover:bg-blue-500"
            >
              Explore jobs
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}