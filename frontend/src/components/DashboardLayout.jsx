import {
  Bell,
  BriefcaseBusiness,
  ChevronRight,
  LogOut,
  Menu,
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
  navItems,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const sidebar = (
    <aside className="flex h-full flex-col bg-[#10243e] text-white">
      <div className="flex h-[72px] items-center border-b border-white/10 px-5">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0066b3]">
            <BriefcaseBusiness size={18} />
          </div>

          <span className="font-extrabold">
            Career<span className="text-blue-300">Flow</span>
          </span>
        </Link>
      </div>

      <div className="flex-1 px-3 py-5">
        <p className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
          Workspace
        </p>

        <nav className="mt-3 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold transition ${
                  active
                    ? "bg-[#0066b3] text-white"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-3">
                  <item.icon size={18} />
                  {item.label}
                </span>

                {active && <ChevronRight size={15} />}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/20 text-blue-300">
            <UserRound size={17} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold">
              {user?.name}
            </p>

            <p className="truncate text-xs text-slate-400">
              {user?.role}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-3 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"
        >
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-[calc(100vh-72px)] bg-[#f6f8fb]">
      <div className="flex">
        <div className="fixed bottom-0 left-0 top-[72px] z-40 hidden w-64 lg:block">
          {sidebar}
        </div>

        {mobileOpen && (
          <div className="fixed inset-0 top-[72px] z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/30"
              onClick={() => setMobileOpen(false)}
            />

            <div className="relative h-full w-72">
              {sidebar}
            </div>
          </div>
        )}

        <section className="w-full lg:ml-64">
          <div className="sticky top-[72px] z-30 border-b border-slate-200 bg-white">
            <div className="flex h-16 items-center justify-between px-4 sm:px-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileOpen(true)}
                  className="rounded-lg p-2 text-slate-600 lg:hidden"
                >
                  <Menu size={21} />
                </button>

                <div>
                  <h1 className="font-extrabold text-[#172b4d]">
                    {title}
                  </h1>
                </div>
              </div>

              <button className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-50">
                <Bell size={19} />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-6">{children}</div>
        </section>
      </div>
    </div>
  );
}
