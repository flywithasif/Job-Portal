import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  MapPin,
  Search,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

import { categories, jobs } from "../data/jobs";
import JobCard from "../components/JobCard";

export default function Home() {
  const navigate = useNavigate();

  const handleSearch = (event) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    const keyword = form.get("keyword");
    const location = form.get("location");

    const params = new URLSearchParams();

    if (keyword) params.set("search", keyword);
    if (location) params.set("location", location);

    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <main>
      <section className="relative overflow-hidden bg-[#f4f8fc]">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-100/60 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-sky-100/50 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pb-24">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-xs font-bold text-[#0066b3] shadow-sm"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              12,000+ new opportunities this week
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="mt-7 text-4xl font-black tracking-tight text-[#172b4d] sm:text-5xl lg:text-6xl"
            >
              Find the work that
              <span className="block text-[#0066b3]">
                moves your career forward.
              </span>
            </motion.h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Discover meaningful opportunities from companies hiring
              across technology, finance, marketing, operations and more.
            </p>

            <form
              onSubmit={handleSearch}
              className="mx-auto mt-9 max-w-4xl rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_20px_60px_rgba(15,60,100,0.12)]"
            >
              <div className="grid gap-2 md:grid-cols-[1fr_0.8fr_auto]">
                <div className="flex items-center gap-3 rounded-xl px-4">
                  <Search
                    size={20}
                    className="shrink-0 text-[#0066b3]"
                  />

                  <input
                    name="keyword"
                    placeholder="Job title, skills or company"
                    className="h-12 w-full bg-transparent text-sm outline-none"
                  />
                </div>

                <div className="flex items-center gap-3 rounded-xl border-t border-slate-100 px-4 md:border-l md:border-t-0">
                  <MapPin
                    size={20}
                    className="shrink-0 text-[#0066b3]"
                  />

                  <input
                    name="location"
                    placeholder="Location"
                    className="h-12 w-full bg-transparent text-sm outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="h-12 rounded-xl bg-[#0066b3] px-7 text-sm font-extrabold text-white transition hover:bg-[#005493]"
                >
                  Search Jobs
                </button>
              </div>
            </form>

            <div className="mt-5 flex flex-wrap justify-center gap-2 text-xs text-slate-500">
              <span>Popular:</span>
              {["Node.js", "React", "MERN", "Data Analyst", "Remote"].map(
                (item) => (
                  <button
                    key={item}
                    onClick={() => navigate(`/jobs?search=${item}`)}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 font-semibold transition hover:border-blue-200 hover:text-[#0066b3]"
                  >
                    {item}
                  </button>
                ),
              )}
            </div>
          </div>

          <div className="mx-auto mt-14 grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["2.4M+", "Job seekers"],
              ["85K+", "Companies"],
              ["120K+", "Active jobs"],
              ["96%", "Profile satisfaction"],
            ].map(([number, label]) => (
              <div
                key={label}
                className="rounded-2xl border border-white bg-white/80 p-5 text-center shadow-sm backdrop-blur"
              >
                <p className="text-2xl font-black text-[#172b4d]">
                  {number}
                </p>
                <p className="mt-1 text-xs font-semibold text-slate-500">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#0066b3]">
              Explore opportunities
            </p>

            <h2 className="mt-2 text-2xl font-black text-[#172b4d] sm:text-3xl">
              Popular job categories
            </h2>
          </div>

          <Link
            to="/jobs"
            className="hidden items-center gap-1 text-sm font-bold text-[#0066b3] sm:flex"
          >
            View all
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <Link
              to={`/jobs?search=${encodeURIComponent(category.title)}`}
              key={category.title}
              className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#0066b3]">
                  {index % 2 === 0 ? (
                    <BriefcaseBusiness size={20} />
                  ) : (
                    <Building2 size={20} />
                  )}
                </div>

                <ArrowRight
                  size={18}
                  className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-[#0066b3]"
                />
              </div>

              <h3 className="mt-5 font-extrabold text-[#172b4d]">
                {category.title}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {category.jobs}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#0066b3]">
                Fresh opportunities
              </p>

              <h2 className="mt-2 text-2xl font-black text-[#172b4d] sm:text-3xl">
                Recommended jobs
              </h2>
            </div>

            <Link
              to="/jobs"
              className="hidden items-center gap-1 text-sm font-bold text-[#0066b3] sm:flex"
            >
              Browse jobs
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {jobs.slice(0, 4).map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-[#10243e] p-8 text-white sm:p-12">
          <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-blue-200">
                Built for modern hiring
              </div>

              <h2 className="mt-5 max-w-xl text-3xl font-black tracking-tight sm:text-4xl">
                Hiring or looking for your next opportunity?
              </h2>

              <p className="mt-4 max-w-xl leading-7 text-slate-300">
                Create your profile, discover relevant opportunities and
                manage every application from one place.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to="/register"
                  className="rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-[#10243e] transition hover:bg-blue-50"
                >
                  Create free profile
                </Link>

                <Link
                  to="/jobs"
                  className="rounded-xl border border-white/20 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-white/10"
                >
                  Explore jobs
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                [TrendingUp, "Career growth"],
                [ShieldCheck, "Trusted profiles"],
                [Users, "Smart matching"],
                [CheckCircle2, "Easy applications"],
              ].map(([Icon, text]) => (
                <div
                  key={text}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <Icon className="text-blue-300" size={22} />
                  <p className="mt-4 text-sm font-bold">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
