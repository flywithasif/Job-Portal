import { useMemo, useState } from "react";
import {
  Search,
  Users,
  UserRound,
  Building2,
  ShieldCheck,
  UserCheck,
  UserX,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Download,
  X,
} from "lucide-react";

import DashboardLayout from "../../components/DashboardLayout";

const navItems = [
  { label: "Dashboard", path: "/admin", icon: Users },
  { label: "Users", path: "/admin/users", icon: UserRound },
  { label: "Companies", path: "/admin/companies", icon: Building2 },
  { label: "Jobs", path: "/admin/jobs", icon: UserCheck },
  { label: "Moderation", path: "/admin/moderation", icon: ShieldCheck },
];

const initialUsers = [
  {
    id: 1,
    name: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    role: "JOB_SEEKER",
    status: "Active",
    joined: "Oct 02, 2026",
    initials: "AS",
  },
  {
    id: 2,
    name: "Priya Mehta",
    email: "priya.mehta@example.com",
    role: "RECRUITER",
    status: "Active",
    joined: "Oct 01, 2026",
    initials: "PM",
  },
  {
    id: 3,
    name: "Rahul Verma",
    email: "rahul.verma@example.com",
    role: "JOB_SEEKER",
    status: "Pending",
    joined: "Sep 30, 2026",
    initials: "RV",
  },
  {
    id: 4,
    name: "Neha Kapoor",
    email: "neha.kapoor@example.com",
    role: "RECRUITER",
    status: "Active",
    joined: "Sep 29, 2026",
    initials: "NK",
  },
  {
    id: 5,
    name: "Kabir Singh",
    email: "kabir.singh@example.com",
    role: "JOB_SEEKER",
    status: "Suspended",
    joined: "Sep 28, 2026",
    initials: "KS",
  },
  {
    id: 6,
    name: "Ananya Gupta",
    email: "ananya.gupta@example.com",
    role: "JOB_SEEKER",
    status: "Active",
    joined: "Sep 26, 2026",
    initials: "AG",
  },
  {
    id: 7,
    name: "Rohan Malhotra",
    email: "rohan.m@example.com",
    role: "RECRUITER",
    status: "Pending",
    joined: "Sep 25, 2026",
    initials: "RM",
  },
  {
    id: 8,
    name: "Ishita Rao",
    email: "ishita.rao@example.com",
    role: "JOB_SEEKER",
    status: "Active",
    joined: "Sep 24, 2026",
    initials: "IR",
  },
];

const roleLabels = {
  JOB_SEEKER: "Job seeker",
  RECRUITER: "Recruiter",
  ADMIN: "Admin",
  SUPER_ADMIN: "Super admin",
};

function getStatusStyle(status) {
  if (status === "Active") return "bg-emerald-50 text-emerald-700";
  if (status === "Suspended") return "bg-rose-50 text-rose-700";
  return "bg-amber-50 text-amber-700";
}

export default function UsersPage() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedUser, setSelectedUser] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query);

      const matchesRole =
        roleFilter === "All" || user.role === roleFilter;

      const matchesStatus =
        statusFilter === "All" || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const activeCount = users.filter((user) => user.status === "Active").length;
  const recruiterCount = users.filter(
    (user) => user.role === "RECRUITER",
  ).length;
  const suspendedCount = users.filter(
    (user) => user.status === "Suspended",
  ).length;

  function changeStatus(userId, nextStatus) {
    setUsers((current) =>
      current.map((user) =>
        user.id === userId ? { ...user, status: nextStatus } : user,
      ),
    );
    setSelectedUser(null);
  }

  function exportUsers() {
    const header = ["Name", "Email", "Role", "Status", "Joined"];
    const rows = filteredUsers.map((user) => [
      user.name,
      user.email,
      roleLabels[user.role] || user.role,
      user.status,
      user.joined,
    ]);

    const csv = [header, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\n");

    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" }),
    );

    const link = document.createElement("a");
    link.href = url;
    link.download = "job-portal-users.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <DashboardLayout title="User Management" navItems={navItems}>
      <main className="mx-auto max-w-[1600px] space-y-7 pb-8">
        <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Administration / Users
            </p>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-[#172b4d] sm:text-3xl">
              User management
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Review accounts, search users, and manage account status.
            </p>
          </div>

          <button
            type="button"
            onClick={exportUsers}
            className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl bg-[#0066b3] px-4 text-sm font-bold text-white transition hover:bg-[#005493]"
          >
            <Download size={17} />
            Export CSV
          </button>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              label: "Total users",
              value: users.length,
              icon: Users,
              color: "bg-blue-50 text-blue-700",
            },
            {
              label: "Active accounts",
              value: activeCount,
              icon: UserCheck,
              color: "bg-emerald-50 text-emerald-700",
            },
            {
              label: "Recruiters",
              value: recruiterCount,
              icon: Building2,
              color: "bg-violet-50 text-violet-700",
            },
          ].map((stat) => {
            const Icon = stat.icon;

            return (
              <article
                key={stat.label}
                className="rounded-2xl border border-slate-200 bg-white p-5"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-500">
                    {stat.label}
                  </p>
                  <div className={`rounded-xl p-3 ${stat.color}`}>
                    <Icon size={20} />
                  </div>
                </div>
                <p className="mt-3 text-3xl font-black text-[#172b4d]">
                  {stat.value}
                </p>
              </article>
            );
          })}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-[#172b4d]">
                All users
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {filteredUsers.length} matching accounts
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="relative sm:col-span-1">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Search name or email"
                  aria-label="Search users"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white"
                />
              </div>

              <select
                value={roleFilter}
                onChange={(event) => {
                  setRoleFilter(event.target.value);
                  setPage(1);
                }}
                aria-label="Filter by role"
                className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none focus:border-blue-400"
              >
                <option value="All">All roles</option>
                <option value="JOB_SEEKER">Job seekers</option>
                <option value="RECRUITER">Recruiters</option>
                <option value="ADMIN">Admins</option>
                <option value="SUPER_ADMIN">Super admins</option>
              </select>

              <select
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value);
                  setPage(1);
                }}
                aria-label="Filter by status"
                className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none focus:border-blue-400"
              >
                <option value="All">All statuses</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead>
                <tr className="border-y border-slate-100 bg-slate-50/70 text-xs uppercase tracking-wider text-slate-400">
                  <th className="px-4 py-4 font-bold">User</th>
                  <th className="px-4 py-4 font-bold">Role</th>
                  <th className="px-4 py-4 font-bold">Status</th>
                  <th className="px-4 py-4 font-bold">Joined</th>
                  <th className="px-4 py-4 text-right font-bold">Action</th>
                </tr>
              </thead>

              <tbody>
                {visibleUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-slate-100 transition hover:bg-slate-50/70 last:border-0"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xs font-extrabold text-blue-700">
                          {user.initials}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-800">
                            {user.name}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-600">
                        {roleLabels[user.role] || user.role}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${getStatusStyle(user.status)}`}
                      >
                        {user.status}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-sm text-slate-500">
                      {user.joined}
                    </td>

                    <td className="px-4 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedUser(user)}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}

                {visibleUsers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-14 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                        <Search size={22} />
                      </div>
                      <p className="mt-3 text-sm font-bold text-slate-700">
                        No users found
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Try changing your search or filters.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">
              Showing{" "}
              {filteredUsers.length === 0
                ? 0
                : (currentPage - 1) * pageSize + 1}
              {"–"}
              {Math.min(currentPage * pageSize, filteredUsers.length)} of{" "}
              {filteredUsers.length} users
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setPage((value) => Math.max(1, value - 1))}
                className="flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={15} />
                Previous
              </button>

              <span className="px-2 text-xs font-semibold text-slate-500">
                {currentPage} / {totalPages}
              </span>

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setPage((value) => Math.min(totalPages, value + 1))
                }
                className="flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </section>

        <p className="flex items-start gap-2 text-xs leading-5 text-slate-400">
          <SlidersHorizontal size={15} className="mt-0.5 shrink-0" />
          Demo records are used in this frontend page. Connect your users API
          before using account management on real users.
        </p>

        {suspendedCount > 0 && (
          <p className="text-xs text-slate-400">
            {suspendedCount} demo account(s) currently marked as suspended.
          </p>
        )}

        {selectedUser && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setSelectedUser(null);
              }
            }}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="user-dialog-title"
              className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-700">
                    Account management
                  </p>
                  <h2
                    id="user-dialog-title"
                    className="mt-2 text-xl font-black text-[#172b4d]"
                  >
                    {selectedUser.name}
                  </h2>
                  <p className="mt-1 break-all text-sm text-slate-500">
                    {selectedUser.email}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  aria-label="Close dialog"
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={19} />
                </button>
              </div>

              <div className="mt-5 rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Current status</p>
                <span
                  className={`mt-2 inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${getStatusStyle(selectedUser.status)}`}
                >
                  {selectedUser.status}
                </span>
                <p className="mt-3 text-xs leading-5 text-slate-500">
                  These actions update only this page's temporary demo state.
                  They do not change a real account in the database.
                </p>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3">
                {selectedUser.status !== "Active" && (
                  <button
                    type="button"
                    onClick={() => changeStatus(selectedUser.id, "Active")}
                    className="flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-bold text-white transition hover:bg-emerald-700"
                  >
                    <UserCheck size={17} />
                    Activate account
                  </button>
                )}

                {selectedUser.status !== "Suspended" && (
                  <button
                    type="button"
                    onClick={() =>
                      changeStatus(selectedUser.id, "Suspended")
                    }
                    className="flex h-11 items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 text-sm font-bold text-rose-700 transition hover:bg-rose-100"
                  >
                    <UserX size={17} />
                    Suspend account
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="h-11 rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </section>
          </div>
        )}
      </main>
    </DashboardLayout>
  );
}
