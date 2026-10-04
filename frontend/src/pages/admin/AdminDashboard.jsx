import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Clock3,
  FileCheck2,
  ShieldCheck,
  Users,
  UserRoundCheck,
  UserRoundSearch,
} from "lucide-react";

import DashboardLayout from "../../components/DashboardLayout";

const navItems = [
  { label: "Dashboard", path: "/admin", icon: Activity },
  { label: "Users", path: "/admin/users", icon: Users },
  { label: "Companies", path: "/admin/companies", icon: Building2 },
  { label: "Jobs", path: "/admin/jobs", icon: BriefcaseBusiness },
  { label: "Moderation", path: "/admin/moderation", icon: ShieldCheck },
];

const stats = [
  {
    label: "Total users",
    value: "24,521",
    change: "+12.8%",
    description: "vs. last month",
    icon: Users,
    color: "bg-blue-50 text-blue-700",
    positive: true,
  },
  {
    label: "Active recruiters",
    value: "2,481",
    change: "+8.2%",
    description: "vs. last month",
    icon: UserRoundCheck,
    color: "bg-violet-50 text-violet-700",
    positive: true,
  },
  {
    label: "Active jobs",
    value: "1,248",
    change: "+5.4%",
    description: "vs. last month",
    icon: BriefcaseBusiness,
    color: "bg-emerald-50 text-emerald-700",
    positive: true,
  },
  {
    label: "Applications",
    value: "84,521",
    change: "-2.1%",
    description: "vs. last month",
    icon: FileCheck2,
    color: "bg-amber-50 text-amber-700",
    positive: false,
  },
];

const activity = [
  { day: "Mon", users: 42, jobs: 28 },
  { day: "Tue", users: 65, jobs: 38 },
  { day: "Wed", users: 50, jobs: 32 },
  { day: "Thu", users: 82, jobs: 48 },
  { day: "Fri", users: 70, jobs: 40 },
  { day: "Sat", users: 92, jobs: 54 },
  { day: "Sun", users: 60, jobs: 35 },
];

const events = [
  {
    title: "New company registered",
    detail: "Northstar Technologies",
    time: "12 minutes ago",
    icon: Building2,
    color: "bg-blue-50 text-blue-700",
  },
  {
    title: "Job submitted for review",
    detail: "Senior Product Designer",
    time: "28 minutes ago",
    icon: BriefcaseBusiness,
    color: "bg-amber-50 text-amber-700",
  },
  {
    title: "New job seeker joined",
    detail: "A new candidate account was created",
    time: "46 minutes ago",
    icon: UserRoundSearch,
    color: "bg-violet-50 text-violet-700",
  },
  {
    title: "Company verification pending",
    detail: "A company needs administrator review",
    time: "1 hour ago",
    icon: Clock3,
    color: "bg-emerald-50 text-emerald-700",
  },
];

const reviews = [
  {
    name: "BrightPath Solutions",
    type: "Company verification",
    status: "Pending",
    badge: "bg-amber-50 text-amber-700",
    initials: "BP",
  },
  {
    name: "Senior Frontend Developer",
    type: "Job listing",
    status: "In review",
    badge: "bg-blue-50 text-blue-700",
    initials: "JD",
  },
  {
    name: "Vertex Digital",
    type: "Company verification",
    status: "Pending",
    badge: "bg-amber-50 text-amber-700",
    initials: "VD",
  },
];

function StatCard({ stat }) {
  const Icon = stat.icon;
  const TrendIcon = stat.positive ? ArrowUpRight : ArrowDownRight;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg hover:shadow-slate-200/50">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{stat.label}</p>
          <h3 className="mt-3 text-2xl font-black tracking-tight text-[#172b4d] sm:text-3xl">
            {stat.value}
          </h3>
        </div>

        <div className={`rounded-xl p-3 ${stat.color}`}>
          <Icon size={21} strokeWidth={2} />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2 text-xs">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 font-bold ${
            stat.positive
              ? "bg-emerald-50 text-emerald-700"
              : "bg-rose-50 text-rose-700"
          }`}
        >
          <TrendIcon size={13} />
          {stat.change}
        </span>
        <span className="text-slate-400">{stat.description}</span>
      </div>
    </article>
  );
}

function SectionHeading({ eyebrow, title, action }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">
          {eyebrow}
        </p>
        <h3 className="mt-1 text-lg font-extrabold tracking-tight text-[#172b4d]">
          {title}
        </h3>
      </div>

      {action}
    </div>
  );
}

export default function AdminDashboard() {
  const maxActivity = Math.max(
    ...activity.map((item) => Math.max(item.users, item.jobs)),
  );

  return (
    <DashboardLayout title="Platform Overview" navItems={navItems}>
      <main className="mx-auto max-w-[1600px] space-y-7 pb-8">
        {/* Page heading */}
        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <ShieldCheck size={16} className="text-blue-700" />
              Administration / Overview
            </div>

            <h1 className="mt-2 text-2xl font-black tracking-tight text-[#172b4d] sm:text-3xl">
              Platform overview
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Monitor platform activity, review submissions, and keep your
              hiring marketplace running smoothly.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 sm:self-auto">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Admin workspace
          </div>
        </section>

        {/* Platform metrics */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </section>

        {/* Activity chart and platform health */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
          <article className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <SectionHeading
              eyebrow="Platform analytics"
              title="Weekly activity"
              action={
                <span className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-500">
                  Last 7 days
                </span>
              }
            />

            <div className="mt-7 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-sm bg-[#0066b3]" />
                New users
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-sm bg-[#93c5fd]" />
                New jobs
              </span>
            </div>

            <div className="mt-6 flex h-52 items-end justify-between gap-3 border-b border-slate-100 pb-2 sm:gap-5">
              {activity.map((item) => (
                <div
                  key={item.day}
                  className="flex h-full flex-1 flex-col items-center justify-end gap-3"
                >
                  <div className="flex h-full w-full items-end justify-center gap-1.5">
                    <div
                      title={`${item.users} activity points for new users`}
                      className="w-full max-w-5 rounded-t-md bg-[#0066b3] transition-opacity hover:opacity-75"
                      style={{
                        height: `${(item.users / maxActivity) * 100}%`,
                      }}
                    />
                    <div
                      title={`${item.jobs} activity points for new jobs`}
                      className="w-full max-w-5 rounded-t-md bg-[#93c5fd] transition-opacity hover:opacity-75"
                      style={{
                        height: `${(item.jobs / maxActivity) * 100}%`,
                      }}
                    />
                  </div>

                  <span className="text-xs font-medium text-slate-400">
                    {item.day}
                  </span>
                </div>
              ))}
            </div>

            <p className="mt-4 text-xs leading-5 text-slate-400">
              Illustrative activity data. Connect your analytics API for live
              platform metrics.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <SectionHeading
              eyebrow="Platform health"
              title="Review queue"
            />

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-4 rounded-xl bg-amber-50/70 p-4">
                <div className="rounded-xl bg-white p-3 text-amber-700 shadow-sm">
                  <Clock3 size={21} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-800">
                    Pending reviews
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Companies and job listings
                  </p>
                </div>
                <span className="text-xl font-black text-[#172b4d]">18</span>
              </div>

              <div className="flex items-center gap-4 rounded-xl bg-emerald-50/70 p-4">
                <div className="rounded-xl bg-white p-3 text-emerald-700 shadow-sm">
                  <CheckCircle2 size={21} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-800">
                    Verified companies
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Approved company profiles
                  </p>
                </div>
                <span className="text-xl font-black text-[#172b4d]">846</span>
              </div>

              <div className="flex items-center gap-4 rounded-xl bg-blue-50/70 p-4">
                <div className="rounded-xl bg-white p-3 text-blue-700 shadow-sm">
                  <BriefcaseBusiness size={21} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-800">
                    Published listings
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Currently active jobs
                  </p>
                </div>
                <span className="text-xl font-black text-[#172b4d]">1,248</span>
              </div>
            </div>
          </article>
        </section>

        {/* Recent reviews */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <SectionHeading
            eyebrow="Needs attention"
            title="Recent review items"
            action={
              <span className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700">
                Administrator review
              </span>
            }
          />

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[600px] text-left">
              <thead>
                <tr className="border-y border-slate-100 text-xs uppercase tracking-wider text-slate-400">
                  <th className="px-3 py-3 font-bold">Item</th>
                  <th className="px-3 py-3 font-bold">Review type</th>
                  <th className="px-3 py-3 font-bold">Status</th>
                </tr>
              </thead>

              <tbody>
                {reviews.map((item) => (
                  <tr
                    key={item.name}
                    className="border-b border-slate-50 last:border-0"
                  >
                    <td className="px-3 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-extrabold text-slate-600">
                          {item.initials}
                        </div>
                        <span className="text-sm font-bold text-slate-800">
                          {item.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-3 py-4 text-sm text-slate-500">
                      {item.type}
                    </td>

                    <td className="px-3 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${item.badge}`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-xs leading-5 text-slate-400">
            Sample review items for the dashboard layout. Live records and
            review actions need to be connected to the admin API.
          </p>
        </section>

        {/* Recent events */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <SectionHeading
            eyebrow="Latest updates"
            title="Recent platform activity"
          />

          <div className="mt-5 divide-y divide-slate-100">
            {events.map((event) => {
              const Icon = event.icon;

              return (
                <div
                  key={event.title}
                  className="flex items-center gap-3 py-4 first:pt-1 last:pb-1 sm:gap-4"
                >
                  <div className={`rounded-xl p-3 ${event.color}`}>
                    <Icon size={19} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-800">
                      {event.title}
                    </p>
                    <p className="mt-1 truncate text-xs text-slate-500">
                      {event.detail}
                    </p>
                  </div>

                  <span className="shrink-0 text-right text-[11px] text-slate-400 sm:text-xs">
                    {event.time}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </DashboardLayout>
  );
}
