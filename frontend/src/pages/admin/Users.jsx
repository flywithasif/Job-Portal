import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  BriefcaseBusiness,
  Building2,
  ChevronLeft,
  ChevronRight,
  FileCheck2,
  Loader2,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  UserCheck,
  UserX,
  Users as UsersIcon,
} from "lucide-react";
import toast from "react-hot-toast";

import DashboardLayout from "../../components/DashboardLayout";
import {
  getAdminUsers,
  updateAdminUserRole,
  updateAdminUserStatus,
} from "../../services/adminService";

const ROLE_OPTIONS = [
  { label: "All roles", value: "ALL" },
  { label: "Job seeker", value: "JOB_SEEKER" },
  { label: "Recruiter", value: "RECRUITER" },
  { label: "Admin", value: "ADMIN" },
  { label: "Super admin", value: "SUPER_ADMIN" },
];

const STATUS_OPTIONS = [
  { label: "All status", value: "ALL" },
  { label: "Active", value: "true" },
  { label: "Suspended", value: "false" },
];

const BASE_NAV_ITEMS = [
  { label: "Dashboard", path: "/admin", icon: Activity },
  { label: "Users", path: "/admin/users", icon: UsersIcon },
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

const formatRole = (role) => {
  if (!role) return "—";

  return role
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (!parts.length) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
};

const getRoleClasses = (role) => {
  switch (role) {
    case "SUPER_ADMIN":
      return "border-violet-200 bg-violet-50 text-violet-700";
    case "ADMIN":
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "RECRUITER":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    default:
      return "border-slate-200 bg-slate-50 text-slate-600";
  }
};

const StatCard = ({ label, value, detail, icon: Icon, iconClasses }) => (
  <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
    <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-slate-50 transition duration-500 group-hover:scale-150" />

    <div className="relative flex items-start justify-between gap-4">
      <div>
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">
          {label}
        </p>
        <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">
          {value}
        </p>
        <p className="mt-1 text-xs font-medium text-slate-400">{detail}</p>
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
    {Array.from({ length: 6 }).map((_, index) => (
      <div
        key={index}
        className="h-16 animate-pulse rounded-xl bg-slate-100"
      />
    ))}
  </div>
);

const UserAvatar = ({ user }) => (
  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#172b4d] text-xs font-black text-white shadow-sm">
    {getInitials(user.name)}
  </div>
);

export default function Users() {
  const currentUser = useMemo(() => getStoredUser(), []);
  const isSuperAdmin = currentUser?.role === "SUPER_ADMIN";

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
        icon: Settings,
      },
    ],
    [isSuperAdmin],
  );

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);

      const params = {
        page,
        limit: 10,
      };

      if (search.trim()) params.search = search.trim();
      if (role !== "ALL") params.role = role;
      if (status !== "ALL") params.isActive = status;

      const response = await getAdminUsers(params);
      const data = response?.data || {};

      setUsers(Array.isArray(data.users) ? data.users : []);

      setPagination({
        page: Number(data.pagination?.page) || page,
        limit: Number(data.pagination?.limit) || 10,
        total: Number(data.pagination?.total) || 0,
        pages: Math.max(Number(data.pagination?.pages) || 1, 1),
      });
    } catch (error) {
      console.error("Failed to load admin users:", error);
      setUsers([]);
      toast.error(
        error?.response?.data?.message || "Failed to load users.",
      );
    } finally {
      setLoading(false);
    }
  }, [page, role, search, status]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleRoleChange = (event) => {
    setRole(event.target.value);
    setPage(1);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    setPage(1);
  };

  const handleStatusUpdate = async (user) => {
    if (!user?._id) return;

    if (currentUser?._id === user._id) {
      toast.error("You cannot change your own status.");
      return;
    }

    const nextStatus = !user.isActive;
    const loadingKey = `status-${user._id}`;

    try {
      setActionLoading(loadingKey);

      await updateAdminUserStatus(user._id, nextStatus);

      setUsers((currentUsers) =>
        currentUsers.map((item) =>
          item._id === user._id
            ? { ...item, isActive: nextStatus }
            : item,
        ),
      );

      toast.success(
        nextStatus
          ? "User activated successfully."
          : "User suspended successfully.",
      );
    } catch (error) {
      console.error("Failed to update user status:", error);
      toast.error(
        error?.response?.data?.message || "Unable to update user status.",
      );
    } finally {
      setActionLoading("");
    }
  };

  const handleRoleUpdate = async (user, nextRole) => {
    if (!isSuperAdmin || !user?._id || !nextRole) return;

    if (currentUser?._id === user._id) {
      toast.error("You cannot change your own role.");
      return;
    }

    if (user.role === "SUPER_ADMIN") {
      toast.error("The Super Admin role is protected.");
      return;
    }

    if (user.role === nextRole) return;

    const loadingKey = `role-${user._id}`;

    try {
      setActionLoading(loadingKey);

      await updateAdminUserRole(user._id, nextRole);

      setUsers((currentUsers) =>
        currentUsers.map((item) =>
          item._id === user._id
            ? { ...item, role: nextRole }
            : item,
        ),
      );

      toast.success("User role updated successfully.");
    } catch (error) {
      console.error("Failed to update user role:", error);
      toast.error(
        error?.response?.data?.message || "Unable to update user role.",
      );
    } finally {
      setActionLoading("");
    }
  };

  const handleRefresh = () => {
    loadUsers();
  };

  const goToPreviousPage = () => {
    if (page > 1) {
      setPage((currentPage) => currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (page < pagination.pages) {
      setPage((currentPage) => currentPage + 1);
    }
  };

  const showingFrom =
    pagination.total === 0 ? 0 : (page - 1) * pagination.limit + 1;

  const showingTo = Math.min(page * pagination.limit, pagination.total);

  return (
    <DashboardLayout title="Users" navItems={navItems}>
      <main className="min-h-full w-full overflow-hidden bg-[#f7f9fc] pb-8">
        <div className="mx-auto w-full max-w-[1500px] space-y-6 px-4 sm:px-6 lg:px-8">
          <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white px-5 py-6 shadow-[0_10px_40px_rgba(15,23,42,0.05)] sm:px-7">
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-50/70 blur-2xl" />
            <div className="absolute -bottom-28 left-1/3 h-52 w-52 rounded-full bg-violet-50/60 blur-3xl" />

            <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-slate-500">
                  <UsersIcon size={14} />
                  Platform administration
                </div>

                <h1 className="text-3xl font-black tracking-tight text-[#172b4d] sm:text-4xl">
                  User management
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  Manage platform accounts, access roles, and account status
                  from one secure workspace.
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

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              label="Total users"
              value={pagination.total}
              detail="Accounts matching current filters"
              icon={UsersIcon}
              iconClasses="bg-blue-50 text-blue-700"
            />

            <StatCard
              label="Loaded"
              value={users.length}
              detail={`Users visible on page ${page}`}
              icon={UserCheck}
              iconClasses="bg-emerald-50 text-emerald-700"
            />

            <StatCard
              label="Page"
              value={`${page} / ${pagination.pages}`}
              detail="Current result page"
              icon={Activity}
              iconClasses="bg-violet-50 text-violet-700"
            />
          </section>

          <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:p-5">
            <div className="mb-4">
              <h2 className="text-sm font-black text-slate-900">
                Search & filters
              </h2>
              <p className="mt-1 text-xs font-medium text-slate-400">
                Find users by identity, role, or account status.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_220px_200px]">
              <div className="relative">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={handleSearch}
                  placeholder="Search by name or email..."
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0066b3] focus:bg-white focus:ring-4 focus:ring-blue-50"
                />
              </div>

              <select
                value={role}
                onChange={handleRoleChange}
                className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-700 outline-none transition focus:border-[#0066b3] focus:bg-white focus:ring-4 focus:ring-blue-50"
              >
                {ROLE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <select
                value={status}
                onChange={handleStatusChange}
                className="h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-700 outline-none transition focus:border-[#0066b3] focus:bg-white focus:ring-4 focus:ring-blue-50"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_10px_40px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-sm font-black text-slate-900">
                  Registered users
                </h2>
                <p className="mt-0.5 text-xs font-medium text-slate-400">
                  {pagination.total} total result
                  {pagination.total === 1 ? "" : "s"}
                </p>
              </div>

              <div className="hidden rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-bold text-slate-500 sm:block">
                Live data
              </div>
            </div>

            <div className="hidden overflow-x-auto md:block">
              {loading ? (
                <TableSkeleton />
              ) : (
                <table className="w-full min-w-[920px]">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/70">
                      <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                        User
                      </th>
                      <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Role
                      </th>
                      <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Status
                      </th>
                      <th className="px-6 py-4 text-right text-[11px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-20 text-center">
                          <UsersIcon
                            size={28}
                            className="mx-auto text-slate-300"
                          />
                          <p className="mt-3 text-sm font-black text-slate-900">
                            No users found
                          </p>
                          <p className="mt-1 text-xs font-medium text-slate-400">
                            Try changing your search or filters.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => {
                        const isCurrentUser = currentUser?._id === user._id;
                        const statusLoading =
                          actionLoading === `status-${user._id}`;
                        const roleLoading =
                          actionLoading === `role-${user._id}`;

                        return (
                          <tr
                            key={user._id}
                            className="group transition hover:bg-slate-50/70"
                          >
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                <UserAvatar user={user} />

                                <div className="min-w-0">
                                  <p className="truncate text-sm font-black text-slate-900">
                                    {user.name || "Unnamed User"}
                                  </p>
                                  <p className="mt-0.5 truncate text-xs font-medium text-slate-400">
                                    {user.email || "No email"}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-5">
                              {isSuperAdmin &&
                              !isCurrentUser &&
                              user.role !== "SUPER_ADMIN" ? (
                                <select
                                  value={user.role}
                                  disabled={roleLoading}
                                  onChange={(event) =>
                                    handleRoleUpdate(
                                      user,
                                      event.target.value,
                                    )
                                  }
                                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 outline-none transition hover:border-slate-300 focus:border-[#0066b3] focus:ring-4 focus:ring-blue-50 disabled:opacity-50"
                                >
                                  <option value="JOB_SEEKER">
                                    Job Seeker
                                  </option>
                                  <option value="RECRUITER">Recruiter</option>
                                  <option value="ADMIN">Admin</option>
                                </select>
                              ) : (
                                <span
                                  className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-black ${getRoleClasses(
                                    user.role,
                                  )}`}
                                >
                                  {user.role === "SUPER_ADMIN" && (
                                    <ShieldCheck size={14} />
                                  )}
                                  {formatRole(user.role)}
                                </span>
                              )}
                            </td>

                            <td className="px-6 py-5">
                              <span
                                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-black ${
                                  user.isActive
                                    ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                                    : "border-red-100 bg-red-50 text-red-700"
                                }`}
                              >
                                <span
                                  className={`h-1.5 w-1.5 rounded-full ${
                                    user.isActive
                                      ? "bg-emerald-500"
                                      : "bg-red-500"
                                  }`}
                                />
                                {user.isActive ? "Active" : "Suspended"}
                              </span>
                            </td>

                            <td className="px-6 py-5 text-right">
                              {isCurrentUser ? (
                                <span className="text-xs font-bold text-slate-400">
                                  Current account
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  disabled={statusLoading}
                                  onClick={() => handleStatusUpdate(user)}
                                  className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-black transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                    user.isActive
                                      ? "bg-red-50 text-red-700 hover:bg-red-100"
                                      : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                  }`}
                                >
                                  {statusLoading ? (
                                    <Loader2
                                      size={15}
                                      className="animate-spin"
                                    />
                                  ) : user.isActive ? (
                                    <UserX size={15} />
                                  ) : (
                                    <UserCheck size={15} />
                                  )}

                                  {user.isActive ? "Suspend" : "Activate"}
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

            <div className="divide-y divide-slate-100 md:hidden">
              {loading ? (
                <TableSkeleton />
              ) : users.length === 0 ? (
                <div className="px-6 py-20 text-center">
                  <UsersIcon
                    size={28}
                    className="mx-auto text-slate-300"
                  />
                  <p className="mt-3 text-sm font-black text-slate-900">
                    No users found
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-400">
                    Try changing your filters.
                  </p>
                </div>
              ) : (
                users.map((user) => {
                  const isCurrentUser = currentUser?._id === user._id;
                  const statusLoading =
                    actionLoading === `status-${user._id}`;
                  const roleLoading = actionLoading === `role-${user._id}`;

                  return (
                    <article
                      key={user._id}
                      className="space-y-4 p-4 transition hover:bg-slate-50/60"
                    >
                      <div className="flex items-start gap-3">
                        <UserAvatar user={user} />

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-black text-slate-900">
                            {user.name || "Unnamed User"}
                          </p>
                          <p className="mt-0.5 truncate text-xs font-medium text-slate-400">
                            {user.email || "No email"}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-black ${
                            user.isActive
                              ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                              : "border-red-100 bg-red-50 text-red-700"
                          }`}
                        >
                          {user.isActive ? "Active" : "Suspended"}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {isSuperAdmin &&
                        !isCurrentUser &&
                        user.role !== "SUPER_ADMIN" ? (
                          <select
                            value={user.role}
                            disabled={roleLoading}
                            onChange={(event) =>
                              handleRoleUpdate(user, event.target.value)
                            }
                            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 outline-none focus:border-[#0066b3] disabled:opacity-50"
                          >
                            <option value="JOB_SEEKER">Job Seeker</option>
                            <option value="RECRUITER">Recruiter</option>
                            <option value="ADMIN">Admin</option>
                          </select>
                        ) : (
                          <span
                            className={`rounded-xl border px-3 py-2 text-xs font-black ${getRoleClasses(
                              user.role,
                            )}`}
                          >
                            {formatRole(user.role)}
                          </span>
                        )}

                        {isCurrentUser ? (
                          <span className="ml-auto text-xs font-bold text-slate-400">
                            Current account
                          </span>
                        ) : (
                          <button
                            type="button"
                            disabled={statusLoading}
                            onClick={() => handleStatusUpdate(user)}
                            className={`ml-auto inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-black transition disabled:opacity-50 ${
                              user.isActive
                                ? "bg-red-50 text-red-700"
                                : "bg-emerald-50 text-emerald-700"
                            }`}
                          >
                            {statusLoading ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : user.isActive ? (
                              <UserX size={14} />
                            ) : (
                              <UserCheck size={14} />
                            )}

                            {user.isActive ? "Suspend" : "Activate"}
                          </button>
                        )}
                      </div>
                    </article>
                  );
                })
              )}
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/60 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="text-xs font-medium text-slate-500">
                Showing{" "}
                <span className="font-black text-slate-700">
                  {showingFrom}
                </span>{" "}
                to{" "}
                <span className="font-black text-slate-700">{showingTo}</span>{" "}
                of{" "}
                <span className="font-black text-slate-700">
                  {pagination.total}
                </span>{" "}
                users
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={goToPreviousPage}
                  disabled={page <= 1 || loading}
                  className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-xs font-black text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={15} />
                  Previous
                </button>

                <span className="min-w-16 text-center text-xs font-black text-slate-600">
                  {page} / {pagination.pages}
                </span>

                <button
                  type="button"
                  onClick={goToNextPage}
                  disabled={page >= pagination.pages || loading}
                  className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-xs font-black text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </DashboardLayout>
  );
}
