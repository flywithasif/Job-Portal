import {
  Bell,
  BriefcaseBusiness,
  ChevronRight,
  LogOut,
  Menu,
  UserRound,
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { user, logout } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully.");
    navigate("/login", { replace: true });
  };

  const isActive = (path) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }

    return (
      location.pathname === path ||
      location.pathname.startsWith(`${path}/`)
    );
  };

  const handleNotificationClick = () => {
    setMobileMenuOpen(false);
    navigate("/dashboard/notifications");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileMenuOpen((current) => !current)}
          aria-label={
            mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100"
        >
          <Menu size={22} />
        </button>

        <Link
          to="/dashboard"
          className="flex items-center gap-2"
          onClick={() => setMobileMenuOpen(false)}
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0066b3] text-white">
            <BriefcaseBusiness size={18} />
          </span>

          <span className="text-lg font-black text-[#172b4d]">
            Career<span className="text-[#0066b3]">Flow</span>
          </span>
        </Link>

        <button
          type="button"
          onClick={handleNotificationClick}
          aria-label="Open notifications"
          title="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-[#0066b3]"
        >
          <Bell size={21} />

          <span
            aria-hidden="true"
            className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"
          />
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#10243e] text-white transition-transform duration-200 lg:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex h-24 shrink-0 items-center border-b border-white/10 px-7">
          <Link
            to="/dashboard"
            className="flex items-center gap-3"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0066b3] text-white shadow-lg shadow-black/10">
              <BriefcaseBusiness size={24} />
            </span>

            <span className="text-xl font-black tracking-tight">
              Career<span className="text-blue-300">Flow</span>
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-7">
          <p className="mb-4 px-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
            Workspace
          </p>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    active
                      ? "bg-[#006fbd] text-white shadow-lg shadow-blue-950/20"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon
                    size={20}
                    className={
                      active
                        ? "text-white"
                        : "text-slate-300 group-hover:text-white"
                    }
                  />

                  <span className="min-w-0 flex-1 truncate">
                    {item.label}
                  </span>

                  {active && <ChevronRight size={17} />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User section */}
        <div className="shrink-0 border-t border-white/10 p-4">
          <div className="mb-3 flex items-center gap-3 rounded-2xl bg-white/5 p-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-blue-200">
              <UserRound size={22} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-white">
                {user?.name || "User"}
              </p>

              <p className="mt-0.5 truncate text-xs font-medium text-slate-400">
                {user?.role || "JOB_SEEKER"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="min-h-screen lg:pl-64">
        {/* Desktop header */}
        <header className="sticky top-0 z-30 hidden h-[88px] items-center justify-between border-b border-slate-200 bg-white/95 px-8 backdrop-blur lg:flex">
          <div className="min-w-0">
            <h1 className="truncate text-xl font-black text-[#172b4d]">
              {title}
            </h1>
          </div>

          <button
            type="button"
            onClick={handleNotificationClick}
            aria-label="Open notifications"
            title="Notifications"
            className="relative flex h-11 w-11 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-[#0066b3]"
          >
            <Bell size={23} />

            <span
              aria-hidden="true"
              className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"
            />
          </button>
        </header>

        {/* Page content */}
        <main className="min-h-[calc(100vh-88px)]">{children}</main>
      </div>
    </div>
  );
}
