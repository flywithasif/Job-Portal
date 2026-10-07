import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  Clock3,
  Flag,
  Settings,
  ShieldCheck,
  Users,
  BriefcaseBusiness,
  Activity,
  Building2,
  FileCheck2,
} from "lucide-react";

import DashboardLayout from "../../components/DashboardLayout";

const BASE_NAV_ITEMS = [
  { label: "Dashboard", path: "/admin", icon: Activity },
  { label: "Users", path: "/admin/users", icon: Users },
  { label: "Companies", path: "/admin/companies", icon: Building2 },
  { label: "Jobs", path: "/admin/jobs", icon: BriefcaseBusiness },
  { label: "Applications", path: "/admin/applications", icon: FileCheck2 },
  { label: "Moderation", path: "/admin/moderation", icon: ShieldCheck },
];

const MODERATION_AREAS = [
  {
    title: "User Reports",
    description:
      "Review reports submitted against users, recruiters, or other platform activity.",
    icon: Flag,
  },
  {
    title: "Job Moderation",
    description:
      "Review suspicious or reported job postings and take moderation actions.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Enforcement",
    description:
      "Manage warnings, restrictions, blocked accounts, and moderation decisions.",
    icon: Ban,
  },
];

const OVERVIEW_ITEMS = [
  {
    label: "Reports",
    icon: Flag,
    iconClasses: "bg-slate-100 text-slate-600",
    cardClasses: "border-slate-200 bg-white",
    labelClasses: "text-slate-400",
  },
  {
    label: "Pending",
    icon: Clock3,
    iconClasses: "bg-amber-100 text-amber-700",
    cardClasses: "border-amber-100 bg-amber-50/50",
    labelClasses: "text-amber-600",
  },
  {
    label: "Resolved",
    icon: CheckCircle2,
    iconClasses: "bg-emerald-100 text-emerald-700",
    cardClasses: "border-emerald-100 bg-emerald-50/50",
    labelClasses: "text-emerald-600",
  },
  {
    label: "Blocked",
    icon: Ban,
    iconClasses: "bg-red-100 text-red-700",
    cardClasses: "border-red-100 bg-red-50/50",
    labelClasses: "text-red-600",
  },
];

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem("job_portal_user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
};

export default function Moderation() {
  const currentUser = getStoredUser();
  const isSuperAdmin = currentUser?.role === "SUPER_ADMIN";

  const navItems = [
    ...BASE_NAV_ITEMS,
    ...(isSuperAdmin
      ? [
          {
            label: "Admin Management",
            path: "/admin/admins",
            icon: ShieldCheck,
          },
        ]
      : []),
    {
      label: "Settings",
      path: "/admin/settings",
      icon: Settings,
    },
  ];

  return (
    <DashboardLayout title="Moderation" navItems={navItems}>
      <main className="min-h-full w-full overflow-hidden bg-[#f7f9fc] pb-8">
        <div className="mx-auto w-full max-w-[1500px] space-y-6 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white px-5 py-6 shadow-[0_10px_40px_rgba(15,23,42,0.05)] sm:px-7">
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-50/70 blur-2xl" />
            <div className="absolute -bottom-28 left-1/3 h-52 w-52 rounded-full bg-violet-50/60 blur-3xl" />

            <div className="relative">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">
                <ShieldCheck size={14} />
                Platform administration
              </div>

              <h1 className="text-3xl font-black tracking-tight text-[#172b4d] sm:text-4xl">
                Moderation
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Review platform content, reports, and moderation activity from
                one central workspace.
              </p>
            </div>
          </section>

          {/* API Notice */}
          <section className="relative overflow-hidden rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-[0_8px_30px_rgba(15,23,42,0.03)] sm:p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <AlertTriangle size={20} />
              </div>

              <div>
                <h2 className="text-sm font-black text-amber-950">
                  Moderation API not connected yet
                </h2>

                <p className="mt-1 max-w-4xl text-xs font-medium leading-5 text-amber-800">
                  The current backend does not expose dedicated moderation or
                  report endpoints. This page intentionally does not display
                  fake moderation data. Once moderation APIs are available,
                  this workspace can be connected directly to real data.
                </p>
              </div>
            </div>
          </section>

          {/* Overview */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {OVERVIEW_ITEMS.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className={`group relative overflow-hidden rounded-2xl border p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(15,23,42,0.07)] ${item.cardClasses}`}
                >
                  <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-white/50 transition duration-500 group-hover:scale-150" />

                  <div className="relative flex items-center justify-between gap-4">
                    <p
                      className={`text-[11px] font-black uppercase tracking-[0.16em] ${item.labelClasses}`}
                    >
                      {item.label}
                    </p>

                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.iconClasses}`}
                    >
                      <Icon size={18} />
                    </div>
                  </div>

                  <p className="relative mt-3 text-3xl font-black tracking-tight text-slate-400">
                    —
                  </p>

                  <p className="relative mt-1 text-xs font-medium text-slate-400">
                    Awaiting moderation API
                  </p>
                </div>
              );
            })}
          </section>

          {/* Moderation Areas */}
          <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_10px_40px_rgba(15,23,42,0.05)]">
            <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
              <h2 className="text-sm font-black text-slate-900">
                Moderation areas
              </h2>

              <p className="mt-1 text-xs font-medium text-slate-400">
                These modules are ready for backend moderation workflows.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 p-4 sm:p-5 lg:grid-cols-3">
              {MODERATION_AREAS.map((area) => {
                const Icon = area.icon;

                return (
                  <div
                    key={area.title}
                    className="group rounded-2xl border border-slate-200 bg-white p-5 transition duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50/60 hover:shadow-[0_12px_35px_rgba(15,23,42,0.06)]"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition group-hover:bg-[#172b4d] group-hover:text-white">
                      <Icon size={20} />
                    </div>

                    <h3 className="mt-5 text-base font-black text-slate-900">
                      {area.title}
                    </h3>

                    <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
                      {area.description}
                    </p>

                    <span className="mt-5 inline-flex rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-black uppercase tracking-wider text-slate-400">
                      API pending
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Backend Readiness */}
          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <ShieldCheck size={20} />
              </div>

              <div className="min-w-0">
                <h2 className="text-sm font-black text-slate-900">
                  Backend integration status
                </h2>

                <p className="mt-1 text-xs font-medium leading-5 text-slate-500">
                  The moderation interface is prepared without introducing
                  unsupported API calls or placeholder records.
                </p>
              </div>

              <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[11px] font-black text-amber-700 sm:ml-auto">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                Awaiting API
              </span>
            </div>
          </section>
        </div>
      </main>
    </DashboardLayout>
  );
}
