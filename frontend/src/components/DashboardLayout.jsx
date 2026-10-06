import {
  Bell,
  BriefcaseBusiness,
  ChevronRight,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  UserRound,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";

export default function DashboardLayout({
  children,
  title,
  navItems = [],
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleNotificationsClick = () => {
    navigate("/dashboard/notifications");
  };

  const sidebar = (
    <aside className="flex h-full w-full flex-col overflow-hidden bg-[#10243e] text-white">
      {/* Sidebar Header */}
      <div
        className={`flex h-[72px] shrink-0 items-center border-b border-white/10 transition-all duration-300 ${
          sidebarCollapsed
            ? "justify-center px-3"
            : "justify-between px-5"
        }`}
      >
        <Link
          to="/"
          className="flex min-w-0 items-center gap-2.5"
          title={sidebarCollapsed ? "CareerFlow" : undefined}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0066b3]">
            <BriefcaseBusiness size={18} />
          </div>

          {!sidebarCollapsed && (
            <span className="whitespace-nowrap font-extrabold">
              Career<span className="text-blue-300">Flow</span>
            </span>
          )}
        </Link>

        {/* Mobile Close */}
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation */}
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 py-5">
        {!sidebarCollapsed && (
          <p className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Workspace
          </p>
        )}

        <nav
          className={`space-y-1 ${
            sidebarCollapsed ? "mt-0" : "mt-3"
          }`}
        >
          {navItems.map((item) => {
            const active = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                title={sidebarCollapsed ? item.label : undefined}
                className={`flex items-center rounded-xl px-3 py-3 text-sm font-semibold transition-all duration-200 ${
                  sidebarCollapsed
                    ? "justify-center"
                    : "justify-between"
                } ${
                  active
                    ? "bg-[#0066b3] text-white shadow-sm"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span
                  className={`flex min-w-0 items-center ${
                    sidebarCollapsed
                      ? "justify-center"
                      : "gap-3"
                  }`}
                >
                  <item.icon size={18} className="shrink-0" />

                  {!sidebarCollapsed && (
                    <span className="truncate">
                      {item.label}
                    </span>
                  )}
                </span>

                {active && !sidebarCollapsed && (
                  <ChevronRight
                    size={15}
                    className="shrink-0"
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Section */}
      <div className="shrink-0 border-t border-white/10 p-4">
        <div
          className={`flex items-center rounded-xl bg-white/5 p-3 transition-all duration-300 ${
            sidebarCollapsed
              ? "justify-center"
              : "gap-3"
          }`}
          title={
            sidebarCollapsed
              ? user?.name || "Account"
              : undefined
          }
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-300">
            <UserRound size={17} />
          </div>

          {!sidebarCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">
                {user?.name}
              </p>

              <p className="truncate text-xs text-slate-400">
                {user?.role}
              </p>
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          title={sidebarCollapsed ? "Logout" : undefined}
          className={`mt-3 flex w-full items-center rounded-xl py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white ${
            sidebarCollapsed
              ? "justify-center px-3"
              : "gap-3 px-3"
          }`}
        >
          <LogOut size={17} />

          {!sidebarCollapsed && "Logout"}
        </button>
      </div>
    </aside>
  );

  const sidebarWidth = sidebarCollapsed
    ? "84px"
    : "256px";

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#f6f8fb]">
      {/* =========================
          DESKTOP SIDEBAR
      ========================== */}
      <div
        className="fixed inset-y-0 left-0 z-40 hidden transition-[width] duration-300 lg:block"
        style={{
          width: sidebarWidth,
        }}
      >
        {sidebar}
      </div>

      {/* =========================
          MOBILE SIDEBAR
      ========================== */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]"
            onClick={() => setMobileOpen(false)}
          />

          <div className="relative h-full w-72 max-w-[85vw] shadow-2xl">
            {sidebar}
          </div>
        </div>
      )}

      {/* =========================
          MAIN AREA
      ========================== */}
      <section
        className="min-h-screen min-w-0 overflow-x-hidden transition-[margin,width] duration-300"
        style={{
          marginLeft: sidebarWidth,
          width: `calc(100vw - ${sidebarWidth})`,
        }}
      >
        {/* =========================
            TOP HEADER
        ========================== */}
        <header className="sticky top-0 z-30 h-[72px] w-full border-b border-slate-200 bg-white/95 backdrop-blur-xl">
          <div className="flex h-full min-w-0 items-center justify-between px-4 sm:px-6">
            {/* Left Header */}
            <div className="flex min-w-0 items-center gap-2">
              {/* Mobile Menu */}
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Open navigation"
                className="rounded-xl p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden"
              >
                <Menu size={21} />
              </button>

              {/* Sidebar Toggle */}
              <button
                type="button"
                onClick={() =>
                  setSidebarCollapsed(
                    (current) => !current,
                  )
                }
                aria-label={
                  sidebarCollapsed
                    ? "Expand sidebar"
                    : "Collapse sidebar"
                }
                title={
                  sidebarCollapsed
                    ? "Expand sidebar"
                    : "Collapse sidebar"
                }
                className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#0066b3] lg:inline-flex"
              >
                {sidebarCollapsed ? (
                  <PanelLeftOpen size={19} />
                ) : (
                  <PanelLeftClose size={19} />
                )}
              </button>

              {/* Page Title */}
              <h1 className="min-w-0 truncate font-extrabold text-[#172b4d] sm:text-lg">
                {title}
              </h1>
            </div>

            {/* Notification Bell */}
            <button
              type="button"
              onClick={handleNotificationsClick}
              aria-label="Open notifications"
              title="Notifications"
              className={`relative ml-3 shrink-0 rounded-xl p-2 transition ${
                location.pathname ===
                "/dashboard/notifications"
                  ? "bg-blue-50 text-[#0066b3]"
                  : "text-slate-500 hover:bg-slate-50 hover:text-[#0066b3]"
              }`}
            >
              <Bell size={20} />

              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
            </button>
          </div>
        </header>

        {/* =========================
            PAGE CONTENT
        ========================== */}
        <main className="w-full min-w-0 overflow-x-hidden p-4 sm:p-6 lg:p-7">
          <div className="mx-auto w-full min-w-0 max-w-[1600px]">
            {children}
          </div>
        </main>
      </section>
    </div>
  );
}