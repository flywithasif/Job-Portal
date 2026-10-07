import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  Building2,
  CheckCircle2,
  ChevronDown,
  FileCheck2,
  Loader2,
  RefreshCw,
  Settings,
  ShieldCheck,
  ShieldOff,
  Users,
  BriefcaseBusiness,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";

import DashboardLayout from "../../components/DashboardLayout";
import {
  getAdminUsers,
  updateAdminUserRole,
  updateAdminUserStatus,
} from "../../services/adminService";

const BASE_NAV_ITEMS = [
  { label: "Dashboard", path: "/admin", icon: Activity },
  { label: "Users", path: "/admin/users", icon: Users },
  { label: "Companies", path: "/admin/companies", icon: Building2 },
  { label: "Jobs", path: "/admin/jobs", icon: BriefcaseBusiness },
  { label: "Applications", path: "/admin/applications", icon: FileCheck2 },
  { label: "Moderation", path: "/admin/moderation", icon: ShieldCheck },
];

const formatDate = (date) => {
  if (!date) return "—";

  try {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
};

const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (!parts.length) return "AD";

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
};

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem("job_portal_user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
};

const StatCard = ({
  label,
  value,
  detail,
  icon: Icon,
  iconClasses,
  cardClasses = "border-slate-200 bg-white",
}) => (
  <div
    className={`group relative overflow-hidden rounded-2xl border p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(15,23,42,0.07)] ${cardClasses}`}
  >
    <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-white/50 transition duration-500 group-hover:scale-150" />

    <div className="relative flex items-start justify-between gap-4">
      <div>
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">
          {label}
        </p>

        <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">
          {value}
        </p>

        <p className="mt-1 text-xs font-medium text-slate-400">
          {detail}
        </p>
      </div>

      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClasses}`}
      >
        <Icon size={20} strokeWidth={2.2} />
      </div>
    </div>
  </div>
);

const TableSkeleton = () => (
  <div className="space-y-3 p-5">
    {Array.from({ length: 4 }).map((_, index) => (
      <div
        key={index}
        className="h-16 animate-pulse rounded-xl bg-slate-100"
      />
    ))}
  </div>
);

export default function AdminManagement() {
  const currentUser = useMemo(() => getStoredUser(), []);
  const currentUserId = currentUser?._id || currentUser?.id;

  const navItems = useMemo(
    () => [
      ...BASE_NAV_ITEMS,
      {
        label: "Admin Management",
        path: "/admin/admins",
        icon: ShieldCheck,
      },
      {
        label: "Settings",
        path: "/admin/settings",
        icon: Settings,
      },
    ],
    [],
  );

  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");

  const [summary, setSummary] = useState({
    admins: 0,
    superAdmins: 0,
    active: 0,
    inactive: 0,
  });

  const loadAdmins = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getAdminUsers({
        page: 1,
        limit: 100,
      });

      const data = response?.data || {};

      const users = Array.isArray(data.users) ? data.users : [];

      const adminUsers = users.filter(
        (user) =>
          user.role === "ADMIN" || user.role === "SUPER_ADMIN",
      );

      setAdmins(adminUsers);

      setSummary({
        admins: adminUsers.filter(
          (user) => user.role === "ADMIN",
        ).length,
        superAdmins: adminUsers.filter(
          (user) => user.role === "SUPER_ADMIN",
        ).length,
        active: adminUsers.filter((user) => user.isActive).length,
        inactive: adminUsers.filter((user) => !user.isActive).length,
      });
    } catch (error) {
      console.error("Failed to load admin users:", error);
      setAdmins([]);

      toast.error(
        error?.response?.data?.message ||
          "Failed to load admin management data.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAdmins();
  }, [loadAdmins]);

  const handleStatusUpdate = async (user) => {
    if (!user?._id) return;

    if (user.role === "SUPER_ADMIN") {
      toast.error("SUPER_ADMIN status cannot be changed here.");
      return;
    }

    if (currentUserId && String(user._id) === String(currentUserId)) {
      toast.error("You cannot change your own account status.");
      return;
    }

    const nextStatus = !user.isActive;
    const loadingKey = `status-${user._id}`;

    try {
      setActionLoading(loadingKey);

      await updateAdminUserStatus(user._id, nextStatus);

      setAdmins((currentAdmins) =>
        currentAdmins.map((item) =>
          item._id === user._id
            ? { ...item, isActive: nextStatus }
            : item,
        ),
      );

      setSummary((currentSummary) => ({
        ...currentSummary,
        active: nextStatus
          ? currentSummary.active + 1
          : Math.max(0, currentSummary.active - 1),
        inactive: nextStatus
          ? Math.max(0, currentSummary.inactive - 1)
          : currentSummary.inactive + 1,
      }));

      toast.success(
        nextStatus
          ? "Admin activated successfully."
          : "Admin suspended successfully.",
      );
    } catch (error) {
      console.error("Failed to update admin status:", error);

      toast.error(
        error?.response?.data?.message ||
          "Unable to update admin status.",
      );
    } finally {
      setActionLoading("");
    }
  };

  const handleRoleUpdate = async (user, nextRole) => {
    if (!user?._id || !nextRole) return;

    if (user.role === "SUPER_ADMIN") {
      toast.error("SUPER_ADMIN cannot be demoted.");
      return;
    }

    if (currentUserId && String(user._id) === String(currentUserId)) {
      toast.error("You cannot change your own account role.");
      return;
    }

    if (nextRole === user.role) return;

    const loadingKey = `role-${user._id}`;

    try {
      setActionLoading(loadingKey);

      await updateAdminUserRole(user._id, nextRole);

      setAdmins((currentAdmins) =>
        currentAdmins.map((item) =>
          item._id === user._id
            ? { ...item, role: nextRole }
            : item,
        ),
      );

      setSummary((currentSummary) => ({
        ...currentSummary,
        admins:
          nextRole === "ADMIN"
            ? currentSummary.admins + 1
            : Math.max(0, currentSummary.admins - 1),
        superAdmins:
          nextRole === "SUPER_ADMIN"
            ? currentSummary.superAdmins + 1
            : Math.max(0, currentSummary.superAdmins - 1),
      }));

      toast.success("Admin role updated successfully.");
    } catch (error) {
      console.error("Failed to update admin role:", error);

      toast.error(
        error?.response?.data?.message ||
          "Unable to update admin role.",
      );
    } finally {
      setActionLoading("");
    }
  };

  const handleRefresh = () => {
    loadAdmins();
  };

  return (
    <DashboardLayout title="Admin Management" navItems={navItems}>
      <main className="min-h-full w-full overflow-hidden bg-[#f7f9fc] pb-8">
        <div className="mx-auto w-full max-w-[1500px] space-y-6 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white px-5 py-6 shadow-[0_10px_40px_rgba(15,23,42,0.05)] sm:px-7">
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-50/80 blur-2xl" />
            <div className="absolute -bottom-28 left-1/3 h-52 w-52 rounded-full bg-blue-50/70 blur-3xl" />

            <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-violet-700">
                  <ShieldCheck size={14} />
                  Super admin controls
                </div>

                <h1 className="text-3xl font-black tracking-tight text-[#172b4d] sm:text-4xl">
                  Admin Management
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  Manage administrator accounts, access roles, and account
                  status from one secure workspace.
                </p>
              </div>

              <button
                type="button"
                onClick={handleRefresh}
                disabled={loading}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-extrabold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw
                  size={17}
                  className={loading ? "animate-spin" : ""}
                />
                Refresh
              </button>
            </div>
          </section>

          {/* Security Notice */}
          <section className="rounded-2xl border border-blue-100 bg-blue-50 p-5 shadow-[0_8px_30px_rgba(15,23,42,0.03)] sm:p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <ShieldCheck size={20} />
              </div>

              <div>
                <h2 className="text-sm font-black text-blue-950">
                  Protected administrator controls
                </h2>

                <p className="mt-1 max-w-4xl text-xs font-medium leading-5 text-blue-700">
                  SUPER_ADMIN accounts are protected from demotion and
                  suspension in this interface. Regular administrator accounts
                  can have their role and active status managed here.
                </p>
              </div>
            </div>
          </section>

          {/* Summary */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Admins"
              value={summary.admins}
              detail="Regular administrator accounts"
              icon={Users}
              iconClasses="bg-slate-100 text-slate-700"
            />

            <StatCard
              label="Super admins"
              value={summary.superAdmins}
              detail="Protected platform administrators"
              icon={ShieldCheck}
              iconClasses="bg-violet-100 text-violet-700"
              cardClasses="border-violet-100 bg-violet-50/50"
            />

            <StatCard
              label="Active"
              value={summary.active}
              detail="Administrator accounts active"
              icon={CheckCircle2}
              iconClasses="bg-emerald-100 text-emerald-700"
              cardClasses="border-emerald-100 bg-emerald-50/50"
            />

            <StatCard
              label="Inactive"
              value={summary.inactive}
              detail="Administrator accounts suspended"
              icon={ShieldOff}
              iconClasses="bg-red-100 text-red-700"
              cardClasses="border-red-100 bg-red-50/50"
            />
          </section>

          {/* Admin Table */}
          <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_10px_40px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-sm font-black text-slate-900">
                  Administrator accounts
                </h2>

                <p className="mt-0.5 text-xs font-medium text-slate-400">
                  {admins.length} administrator
                  {admins.length === 1 ? "" : "s"} loaded
                </p>
              </div>

              <div className="hidden rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 text-[11px] font-black text-violet-700 sm:block">
                Restricted area
              </div>
            </div>

            {/* Desktop */}
            <div className="hidden overflow-x-auto md:block">
              {loading ? (
                <TableSkeleton />
              ) : (
                <table className="w-full min-w-[950px]">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/70">
                      <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Administrator
                      </th>
                      <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Role
                      </th>
                      <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Created
                      </th>
                      <th className="px-6 py-4 text-right text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {admins.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-20 text-center">
                          <div className="mx-auto flex max-w-sm flex-col items-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                              <ShieldCheck size={24} />
                            </div>

                            <h3 className="mt-4 text-sm font-black text-slate-900">
                              No administrators found
                            </h3>

                            <p className="mt-1 text-xs font-medium text-slate-400">
                              There are currently no ADMIN or SUPER_ADMIN
                              accounts available.
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      admins.map((admin) => {
                        const isSuperAdmin =
                          admin.role === "SUPER_ADMIN";

                        const isCurrentUser =
                          currentUserId &&
                          String(admin._id) === String(currentUserId);

                        const statusLoading =
                          actionLoading === `status-${admin._id}`;

                        const roleLoading =
                          actionLoading === `role-${admin._id}`;

                        return (
                          <tr
                            key={admin._id}
                            className="group transition hover:bg-slate-50/70"
                          >
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xs font-black text-white ${
                                    isSuperAdmin
                                      ? "bg-violet-700"
                                      : "bg-[#172b4d]"
                                  }`}
                                >
                                  {getInitials(admin.name)}
                                </div>

                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <p className="max-w-[220px] truncate text-sm font-black text-slate-900">
                                      {admin.name || "Unnamed Admin"}
                                    </p>

                                    {isCurrentUser ? (
                                      <span className="shrink-0 rounded-full bg-blue-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-blue-700">
                                        You
                                      </span>
                                    ) : null}
                                  </div>

                                  <p className="mt-0.5 max-w-[260px] truncate text-xs font-medium text-slate-400">
                                    {admin.email || "No email"}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-5">
                              {isSuperAdmin ? (
                                <span className="inline-flex items-center gap-1.5 rounded-xl border border-violet-100 bg-violet-50 px-3 py-1.5 text-xs font-black text-violet-700">
                                  <ShieldCheck size={14} />
                                  SUPER ADMIN
                                </span>
                              ) : (
                                <div className="relative inline-flex">
                                  <select
                                    value={admin.role}
                                    disabled={roleLoading || isCurrentUser}
                                    onChange={(event) =>
                                      handleRoleUpdate(
                                        admin,
                                        event.target.value,
                                      )
                                    }
                                    className="h-10 appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-9 text-xs font-black text-slate-700 outline-none transition hover:border-slate-300 focus:border-[#0066b3] focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                                  >
                                    <option value="ADMIN">ADMIN</option>
                                    <option value="SUPER_ADMIN">
                                      SUPER ADMIN
                                    </option>
                                  </select>

                                  <ChevronDown
                                    size={14}
                                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                                  />
                                </div>
                              )}
                            </td>

                            <td className="px-6 py-5">
                              <span
                                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-black ${
                                  admin.isActive
                                    ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                                    : "border-red-100 bg-red-50 text-red-700"
                                }`}
                              >
                                <span
                                  className={`h-1.5 w-1.5 rounded-full ${
                                    admin.isActive
                                      ? "bg-emerald-500"
                                      : "bg-red-500"
                                  }`}
                                />
                                {admin.isActive ? "Active" : "Suspended"}
                              </span>
                            </td>

                            <td className="px-6 py-5">
                              <span className="text-sm font-medium text-slate-600">
                                {formatDate(admin.createdAt)}
                              </span>
                            </td>

                            <td className="px-6 py-5 text-right">
                              {isSuperAdmin ? (
                                <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-50 px-3 py-2 text-xs font-bold text-slate-400">
                                  <ShieldOff size={14} />
                                  Protected
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  disabled={
                                    statusLoading || isCurrentUser
                                  }
                                  onClick={() =>
                                    handleStatusUpdate(admin)
                                  }
                                  className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-black transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                    admin.isActive
                                      ? "bg-red-50 text-red-700 hover:bg-red-100"
                                      : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                  }`}
                                >
                                  {statusLoading ? (
                                    <Loader2
                                      size={15}
                                      className="animate-spin"
                                    />
                                  ) : admin.isActive ? (
                                    <XCircle size={15} />
                                  ) : (
                                    <CheckCircle2 size={15} />
                                  )}

                                  {admin.isActive ? "Suspend" : "Activate"}
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              )}
            </div>

            {/* Mobile */}
            <div className="divide-y divide-slate-100 md:hidden">
              {loading ? (
                <TableSkeleton />
              ) : admins.length === 0 ? (
                <div className="px-6 py-20 text-center">
                  <ShieldCheck
                    size={28}
                    className="mx-auto text-slate-300"
                  />

                  <p className="mt-3 text-sm font-black text-slate-900">
                    No administrators found
                  </p>

                  <p className="mt-1 text-xs font-medium text-slate-400">
                    No admin accounts are currently available.
                  </p>
                </div>
              ) : (
                admins.map((admin) => {
                  const isSuperAdmin =
                    admin.role === "SUPER_ADMIN";

                  const isCurrentUser =
                    currentUserId &&
                    String(admin._id) === String(currentUserId);

                  const statusLoading =
                    actionLoading === `status-${admin._id}`;

                  const roleLoading =
                    actionLoading === `role-${admin._id}`;

                  return (
                    <article
                      key={admin._id}
                      className="space-y-4 p-4 transition hover:bg-slate-50/60"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xs font-black text-white ${
                            isSuperAdmin
                              ? "bg-violet-700"
                              : "bg-[#172b4d]"
                          }`}
                        >
                          {getInitials(admin.name)}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-black text-slate-900">
                              {admin.name || "Unnamed Admin"}
                            </p>

                            {isCurrentUser ? (
                              <span className="shrink-0 rounded-full bg-blue-50 px-2 py-0.5 text-[9px] font-black uppercase text-blue-700">
                                You
                              </span>
                            ) : null}
                          </div>

                          <p className="mt-1 truncate text-xs font-medium text-slate-400">
                            {admin.email || "No email"}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-black ${
                            admin.isActive
                              ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                              : "border-red-100 bg-red-50 text-red-700"
                          }`}
                        >
                          {admin.isActive ? "Active" : "Suspended"}
                        </span>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                          Role
                        </p>

                        {isSuperAdmin ? (
                          <div className="mt-2 flex items-center gap-2 rounded-xl border border-violet-100 bg-violet-50 p-3">
                            <ShieldCheck
                              size={16}
                              className="text-violet-700"
                            />

                            <span className="text-xs font-black text-violet-700">
                              SUPER ADMIN
                            </span>
                          </div>
                        ) : (
                          <div className="relative mt-2">
                            <select
                              value={admin.role}
                              disabled={roleLoading || isCurrentUser}
                              onChange={(event) =>
                                handleRoleUpdate(
                                  admin,
                                  event.target.value,
                                )
                              }
                              className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-9 text-xs font-black text-slate-700 outline-none focus:border-[#0066b3] focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
                            >
                              <option value="ADMIN">ADMIN</option>
                              <option value="SUPER_ADMIN">
                                SUPER ADMIN
                              </option>
                            </select>

                            <ChevronDown
                              size={15}
                              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                        <div>
                          <p className="text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                            Created
                          </p>

                          <p className="mt-1 text-xs font-bold text-slate-600">
                            {formatDate(admin.createdAt)}
                          </p>
                        </div>

                        {isSuperAdmin ? (
                          <span className="inline-flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-400">
                            <ShieldOff size={14} />
                            Protected
                          </span>
                        ) : (
                          <button
                            type="button"
                            disabled={statusLoading || isCurrentUser}
                            onClick={() => handleStatusUpdate(admin)}
                            className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-black transition disabled:cursor-not-allowed disabled:opacity-50 ${
                              admin.isActive
                                ? "bg-red-50 text-red-700 hover:bg-red-100"
                                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            }`}
                          >
                            {statusLoading ? (
                              <Loader2
                                size={15}
                                className="animate-spin"
                              />
                            ) : admin.isActive ? (
                              <XCircle size={15} />
                            ) : (
                              <CheckCircle2 size={15} />
                            )}

                            {admin.isActive
                              ? "Suspend Admin"
                              : "Activate Admin"}
                          </button>
                        )}
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </section>
        </div>
      </main>
    </DashboardLayout>
  );
}
