import {
  BarChart3,
  BriefcaseBusiness,
  Building2,
  ShieldCheck,
  Users,
} from "lucide-react";

import DashboardLayout from "../../components/DashboardLayout";

const navItems = [
  {
    label: "Dashboard",
    path: "/admin",
    icon: BarChart3,
  },
  {
    label: "Users",
    path: "/admin/users",
    icon: Users,
  },
  {
    label: "Companies",
    path: "/admin/companies",
    icon: Building2,
  },
  {
    label: "Jobs",
    path: "/admin/jobs",
    icon: BriefcaseBusiness,
  },
  {
    label: "Moderation",
    path: "/admin/moderation",
    icon: ShieldCheck,
  },
];

export default function AdminDashboard() {
  const stats = [
    ["24,521", "Total Users"],
    ["2,481", "Recruiters"],
    ["1,248", "Active Jobs"],
    ["84,521", "Applications"],
  ];

  return (
    <DashboardLayout
      title="Platform Overview"
      navItems={navItems}
    >
      <div className="mx-auto max-w-7xl">
        <div>
          <p className="text-sm text-slate-500">
            System administration
          </p>

          <h2 className="mt-1 text-2xl font-black text-[#172b4d]">
            Platform analytics
          </h2>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(([value, label]) => (
            <div
              key={label}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <p className="text-2xl font-black text-[#172b4d]">
                {value}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {label}
              </p>

              <div className="mt-4 h-1.5 rounded-full bg-slate-100">
                <div className="h-1.5 w-2/3 rounded-full bg-[#0066b3]" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-[#172b4d]">
                  Platform Activity
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Applications across the last 7 days
                </p>
              </div>
            </div>

            <div className="mt-8 flex h-56 items-end gap-3 border-b border-l border-slate-100 px-4 pb-0">
              {[40, 58, 45, 72, 65, 88, 76].map(
                (height, index) => (
                  <div
                    key={index}
                    className="flex h-full flex-1 items-end justify-center"
                  >
                    <div
                      style={{ height: `${height}%` }}
                      className="w-full max-w-10 rounded-t-lg bg-[#0066b3] opacity-90"
                    />
                  </div>
                ),
              )}
            </div>

            <div className="mt-3 flex justify-between px-3 text-[10px] font-bold uppercase tracking-wide text-slate-400">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                (day) => (
                  <span key={day}>{day}</span>
                ),
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="font-extrabold text-[#172b4d]">
              Top Categories
            </h3>

            <div className="mt-6 space-y-5">
              {[
                ["IT & Software", "38%"],
                ["Sales", "21%"],
                ["Finance", "16%"],
                ["Marketing", "13%"],
                ["Other", "12%"],
              ].map(([name, percentage]) => (
                <div key={name}>
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-600">
                      {name}
                    </span>

                    <span className="font-bold text-[#172b4d]">
                      {percentage}
                    </span>
                  </div>

                  <div className="mt-2 h-2 rounded-full bg-slate-100">
                    <div
                      style={{
                        width: percentage,
                      }}
                      className="h-2 rounded-full bg-[#0066b3]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="font-extrabold text-[#172b4d]">
            Recent Platform Events
          </h3>

          <div className="mt-5 space-y-3">
            {[
              ["New company registered", "TechNova Labs", "5 min ago"],
              ["Job published", "Node.js Backend Developer", "18 min ago"],
              ["Company verified", "CloudBridge Systems", "42 min ago"],
              ["1,000th application today", "Platform milestone", "1 hr ago"],
            ].map(([event, subject, time]) => (
              <div
                key={`${event}-${subject}`}
                className="flex flex-col justify-between gap-2 rounded-xl bg-slate-50 p-4 sm:flex-row sm:items-center"
              >
                <div>
                  <p className="text-sm font-bold text-[#172b4d]">
                    {event}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {subject}
                  </p>
                </div>

                <span className="text-xs font-semibold text-slate-400">
                  {time}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
