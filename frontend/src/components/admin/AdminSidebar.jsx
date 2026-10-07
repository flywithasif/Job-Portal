import { NavLink, useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  Building2,
  FileText,
  LayoutDashboard,
  LogOut,
  MessageSquareWarning,
  Settings,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

// ============================================
// NAVIGATION
// ============================================

const baseNavigation = [
  {
    label: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
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
    label: "Applications",
    path: "/admin/applications",
    icon: FileText,
  },
  {
    label: "Moderation",
    path: "/admin/moderation",
    icon: MessageSquareWarning,
  },
];

// ============================================
// COMPONENT
// ============================================

export default function AdminSidebar({
  mobileOpen = false,
  onClose,
}) {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const isSuperAdmin =
    user?.role === "SUPER_ADMIN";

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    logout();

    navigate("/login", {
      replace: true,
    });

    onClose?.();
  };

  // ==========================================
  // NAVIGATION
  // ==========================================

  const navigation = [
    ...baseNavigation,

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

  // ==========================================
  // SIDEBAR
  // ==========================================

  return (
    <>
      {/* ========================================
          MOBILE OVERLAY
      ======================================== */}

      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden"
        />
      ) : null}

      {/* ========================================
          SIDEBAR
      ======================================== */}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:static lg:z-auto lg:translate-x-0 ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {/* ======================================
            BRAND
        ====================================== */}

        <div className="flex h-20 shrink-0 items-center justify-between border-b border-slate-200 px-5">
          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="flex items-center gap-3 text-left"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white shadow-sm">
              <ShieldCheck size={20} />
            </div>

            <div>
              <p className="text-sm font-black tracking-tight text-slate-950">
                JobPortal
              </p>

              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                Admin Console
              </p>
            </div>
          </button>

          {/* Mobile close */}

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-900 lg:hidden"
            aria-label="Close navigation"
          >
            <X size={19} />
          </button>
        </div>

        {/* ======================================
            ADMIN PROFILE
        ====================================== */}

        <div className="border-b border-slate-100 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-xs font-bold text-white">
              {user?.name
                ? user.name
                    .split(" ")
                    .slice(0, 2)
                    .map(
                      (part) =>
                        part[0],
                    )
                    .join("")
                    .toUpperCase()
                : "AD"}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-900">
                {user?.name ||
                  "Administrator"}
              </p>

              <p className="truncate text-xs text-slate-500">
                {isSuperAdmin
                  ? "SUPER ADMIN"
                  : "ADMIN"}
              </p>
            </div>
          </div>
        </div>

        {/* ======================================
            NAVIGATION
        ====================================== */}

        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
            Workspace
          </p>

          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/admin"}
                  onClick={onClose}
                  className={({ isActive }) =>
                    [
                      "group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all",
                      isActive
                        ? "bg-slate-950 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
                    ].join(" ")
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={18}
                        strokeWidth={
                          isActive
                            ? 2.2
                            : 1.9
                        }
                      />

                      <span className="flex-1">
                        {item.label}
                      </span>

                      {item.label ===
                      "Admin Management" ? (
                        <span
                          className={`rounded-md px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wide ${
                            isActive
                              ? "bg-white/15 text-white"
                              : "bg-violet-50 text-violet-600"
                          }`}
                        >
                          Super
                        </span>
                      ) : null}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* ======================================
            BOTTOM SECTION
        ====================================== */}

        <div className="shrink-0 border-t border-slate-200 p-3">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-600 transition hover:bg-red-50 hover:text-red-700"
          >
            <LogOut size={18} />

            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}