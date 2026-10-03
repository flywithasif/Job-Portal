import {
  ArrowUpRight,
  Bookmark,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Search,
} from "lucide-react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../components/DashboardLayout";
import { jobs } from "../../data/jobs";

const navItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: BriefcaseBusiness,
  },
  {
    label: "Find Jobs",
    path: "/jobs",
    icon: Search,
  },
  {
    label: "Applications",
    path: "/dashboard/applications",
    icon: FileText,
  },
  {
    label: "Saved Jobs",
    path: "/dashboard/saved",
    icon: Bookmark,
  },
  {
    label: "Interviews",
    path: "/dashboard/interviews",
    icon: CalendarDays,
  },
];

export default function SeekerDashboard() {
  return (
    <DashboardLayout
      title="Job Seeker Dashboard"
      navItems={navItems}
    >
      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl bg-[#10243e] p-6 text-white sm:p-8">
          <p className="text-sm text-blue-200">
            Good morning, Asif 👋
          </p>

          <h2 className="mt-2 text-2xl font-black">
            Keep your career moving forward.
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
            You have new opportunities matching your profile. Complete your
            profile to improve your recommendations.
          </p>

          <Link
            to="/jobs"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0066b3] px-5 py-3 text-sm font-bold text-white"
          >
            Explore Jobs
            <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["24", "Applications", FileText],
            ["5", "Shortlisted", CheckCircle2],
            ["2", "Interviews", CalendarDays],
            ["8", "Saved Jobs", Bookmark],
          ].map(([number, label, Icon]) => (
            <div
              key={label}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0066b3]">
                  <Icon size={19} />
                </div>

                <ArrowUpRight
                  size={17}
                  className="text-slate-300"
                />
              </div>

              <p className="mt-5 text-2xl font-black text-[#172b4d]">
                {number}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-[#172b4d]">
                  Recommended Jobs
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Based on your skills and preferences
                </p>
              </div>

              <Link
                to="/jobs"
                className="text-xs font-bold text-[#0066b3]"
              >
                View all
              </Link>
            </div>

            <div className="mt-5 space-y-3">
              {jobs.slice(0, 3).map((job) => (
                <Link
                  key={job.id}
                  to={`/jobs/${job.id}`}
                  className="flex items-center gap-4 rounded-xl border border-slate-100 p-4 transition hover:border-blue-100 hover:bg-blue-50/30"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0066b3]">
                    <BriefcaseBusiness size={18} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-extrabold text-[#172b4d]">
                      {job.title}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {job.company} · {job.location}
                    </p>
                  </div>

                  <span className="hidden text-xs font-bold text-[#0066b3] sm:block">
                    {job.salary}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="font-extrabold text-[#172b4d]">
              Application Activity
            </h3>

            <div className="mt-6 space-y-6">
              {[
                ["Node.js Developer", "Shortlisted", "Today"],
                ["MERN Developer", "Application viewed", "Yesterday"],
                ["Backend Engineer", "Applied", "2 days ago"],
              ].map(([job, status, date]) => (
                <div
                  key={job}
                  className="flex gap-3"
                >
                  <div className="mt-1 h-2.5 w-2.5 rounded-full bg-[#0066b3]" />

                  <div>
                    <p className="text-sm font-bold text-[#172b4d]">
                      {job}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {status} · {date}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-xl bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm font-bold text-[#172b4d]">
                <Clock3 size={16} className="text-[#0066b3]" />
                Profile completion
              </div>

              <div className="mt-3 h-2 rounded-full bg-slate-200">
                <div className="h-2 w-[82%] rounded-full bg-[#0066b3]" />
              </div>

              <p className="mt-2 text-xs text-slate-500">
                82% complete — add your portfolio to reach 100%.
              </p>
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
