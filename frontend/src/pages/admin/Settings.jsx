import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Bell,
  Building2,
  CheckCircle2,
  FileCheck2,
  LockKeyhole,
  Mail,
  Phone,
  Settings as SettingsIcon,
  ShieldCheck,
  UserRound,
  Users,
  BriefcaseBusiness,
} from "lucide-react";
import toast from "react-hot-toast";

import DashboardLayout from "../../components/DashboardLayout";

const BASE_NAV_ITEMS = [
  { label: "Dashboard", path: "/admin", icon: Activity },
  { label: "Users", path: "/admin/users", icon: Users },
  { label: "Companies", path: "/admin/companies", icon: Building2 },
  { label: "Jobs", path: "/admin/jobs", icon: BriefcaseBusiness },
  { label: "Applications", path: "/admin/applications", icon: FileCheck2 },
  { label: "Moderation", path: "/admin/moderation", icon: ShieldCheck },
];

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem("job_portal_user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
};

const Toggle = ({ checked, onChange, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={() => onChange(!checked)}
    className={`relative h-7 w-12 shrink-0 rounded-full transition duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 ${
      checked ? "bg-[#172b4d]" : "bg-slate-200"
    }`}
  >
    <span
      className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition duration-200 ${
        checked ? "left-6" : "left-1"
      }`}
    />
  </button>
);

const SectionHeader = ({
  icon: Icon,
  title,
  description,
  iconClasses = "bg-slate-100 text-slate-700",
}) => (
  <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
    <div className="flex items-center gap-3">
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClasses}`}
      >
        <Icon size={19} />
      </div>

      <div>
        <h2 className="text-sm font-black text-slate-900">{title}</h2>
        <p className="mt-0.5 text-xs font-medium text-slate-400">
          {description}
        </p>
      </div>
    </div>
  </div>
);

export default function Settings() {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);

  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  const navItems = useMemo(
    () => [
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
        icon: SettingsIcon,
      },
    ],
    [isSuperAdmin],
  );

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("job_portal_user");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to load settings user:", error);
    }
  }, []);

  const handleNotificationChange = (value) => {
    setNotifications(value);
    toast.success("Notification preference updated.");
  };

  const handleSecurityChange = (value) => {
    setSecurityAlerts(value);
    toast.success("Security preference updated.");
  };

  const handleUnavailableAction = (message) => {
    toast(message, {
      icon: "ℹ️",
    });
  };

  return (
    <DashboardLayout title="Settings" navItems={navItems}>
      <main className="min-h-full w-full overflow-hidden bg-[#f7f9fc] pb-8">
        <div className="mx-auto w-full max-w-[1200px] space-y-6 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white px-5 py-6 shadow-[0_10px_40px_rgba(15,23,42,0.05)] sm:px-7">
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-50/80 blur-2xl" />
            <div className="absolute -bottom-28 left-1/3 h-52 w-52 rounded-full bg-violet-50/60 blur-3xl" />

            <div className="relative">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">
                <SettingsIcon size={14} />
                Administration
              </div>

              <h1 className="text-3xl font-black tracking-tight text-[#172b4d] sm:text-4xl">
                Settings
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Manage your administrator profile, security controls, and
                platform preferences.
              </p>
            </div>
          </section>

          {/* Profile */}
          <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_10px_40px_rgba(15,23,42,0.05)]">
            <SectionHeader
              icon={UserRound}
              title="Administrator Profile"
              description="Your current account information."
            />

            <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-6">
              <div>
                <label className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                  Full Name
                </label>

                <div className="mt-2 flex min-h-11 items-center rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-700">
                  {user?.name || "Administrator"}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                  Email
                </label>

                <div className="mt-2 flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-700">
                  <Mail size={15} className="shrink-0 text-slate-400" />
                  <span className="truncate">{user?.email || "—"}</span>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                  Mobile Number
                </label>

                <div className="mt-2 flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-700">
                  <Phone size={15} className="shrink-0 text-slate-400" />
                  <span>{user?.phone || user?.mobile || "Not added"}</span>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                  Role
                </label>

                <div className="mt-2 flex min-h-11 items-center gap-2 rounded-xl border border-violet-100 bg-violet-50 px-4 text-sm font-black text-violet-700">
                  <ShieldCheck size={15} />
                  {user?.role || "ADMIN"}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                  Account Status
                </label>

                <div className="mt-2 flex min-h-11 items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 text-sm font-black text-emerald-700">
                  <CheckCircle2 size={15} />
                  {user?.isActive ? "Active" : "Unknown"}
                </div>
              </div>
            </div>
          </section>

          {/* Security */}
          <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_10px_40px_rgba(15,23,42,0.05)]">
            <SectionHeader
              icon={LockKeyhole}
              title="Security"
              description="Security controls for your administrator account."
            />

            <div className="divide-y divide-slate-100">
              {/* Password */}
              <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                    <LockKeyhole size={16} />
                  </div>

                  <div>
                    <p className="text-sm font-black text-slate-900">
                      Password
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Change your administrator account password.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleUnavailableAction(
                      "Password update API will be connected next.",
                    )
                  }
                  className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-xs font-black text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Change Password
                </button>
              </div>

              {/* Security Alerts */}
              <div className="flex items-center justify-between gap-4 p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <Bell
                    size={18}
                    className="mt-0.5 shrink-0 text-slate-400"
                  />

                  <div>
                    <p className="text-sm font-black text-slate-900">
                      Security Alerts
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Receive alerts about important security activity.
                    </p>
                  </div>
                </div>

                <Toggle
                  checked={securityAlerts}
                  onChange={handleSecurityChange}
                  label="Toggle security alerts"
                />
              </div>
            </div>
          </section>

          {/* Notifications */}
          <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_10px_40px_rgba(15,23,42,0.05)]">
            <SectionHeader
              icon={Bell}
              title="Notifications"
              description="Control administrator notification preferences."
              iconClasses="bg-blue-50 text-blue-700"
            />

            <div className="p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                    <Bell size={16} />
                  </div>

                  <div>
                    <p className="text-sm font-black text-slate-900">
                      Platform Notifications
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Receive important platform activity notifications.
                    </p>
                  </div>
                </div>

                <Toggle
                  checked={notifications}
                  onChange={handleNotificationChange}
                  label="Toggle platform notifications"
                />
              </div>
            </div>
          </section>

          {/* Backend Notice */}
          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <ShieldCheck size={19} />
              </div>

              <div>
                <p className="text-sm font-black text-slate-900">
                  Settings API status
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Profile editing, mobile number update, password update, and
                  persistent notification preferences will be connected when
                  their backend endpoints are available.
                </p>

                <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-amber-100 bg-amber-50 px-3 py-1.5 text-[11px] font-black text-amber-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  Backend integration pending
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </DashboardLayout>
  );
}
