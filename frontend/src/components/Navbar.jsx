import { useState } from "react";
import {
  BriefcaseBusiness,
  Menu,
  UserRound,
  X,
} from "lucide-react";
import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // ==========================================
  // DASHBOARD PATH
  // ==========================================

  const dashboardPath =
    user?.role === "RECRUITER"
      ? "/recruiter"
      : user?.role === "ADMIN" ||
          user?.role === "SUPER_ADMIN"
        ? "/admin"
        : "/dashboard";

  // ==========================================
  // PROFILE PATH
  // ==========================================

  const profilePath =
    user?.role === "RECRUITER"
      ? "/recruiter/company-profile"
      : user?.role === "ADMIN" ||
          user?.role === "SUPER_ADMIN"
        ? "/admin"
        : "/profile";

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    logout();

    setMobileOpen(false);

    toast.success("Logged out successfully");

    navigate("/");
  };

  // ==========================================
  // NAV LINK STYLE
  // ==========================================

  const navClass = ({ isActive }) =>
    `text-sm font-semibold transition ${
      isActive
        ? "text-[#0066b3]"
        : "text-slate-600 hover:text-[#0066b3]"
    }`;

  // ==========================================
  // CLOSE MOBILE MENU
  // ==========================================

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ======================================
            LOGO
        ======================================= */}

        <Link
          to="/"
          onClick={closeMobileMenu}
          className="flex items-center gap-2.5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0066b3] text-white shadow-sm">
            <BriefcaseBusiness size={21} />
          </div>

          <div>
            <div className="text-xl font-extrabold tracking-tight text-[#172b4d]">
              Career
              <span className="text-[#0066b3]">
                Flow
              </span>
            </div>

            <div className="hidden text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 sm:block">
              Find. Apply. Grow.
            </div>
          </div>
        </Link>

        {/* ======================================
            DESKTOP NAVIGATION
        ======================================= */}

        <nav className="hidden items-center gap-7 lg:flex">
          {/* Dashboard */}
          {user && (
            <NavLink
              to={dashboardPath}
              className={navClass}
            >
              Dashboard
            </NavLink>
          )}

          {/* Find Jobs */}
          <NavLink
            to="/jobs"
            className={navClass}
          >
            Find Jobs
          </NavLink>

          {/* Companies */}
          <NavLink
            to="/companies"
            className={navClass}
          >
            Companies
          </NavLink>

          {/* Career Advice */}
          <NavLink
            to="/career-advice"
            className={navClass}
          >
            Career Advice
          </NavLink>

          {/* Recruiter */}
          {user?.role === "RECRUITER" && (
            <NavLink
              to="/recruiter"
              className={navClass}
            >
              Recruiter
            </NavLink>
          )}

          {/* Admin */}
          {(user?.role === "ADMIN" ||
            user?.role === "SUPER_ADMIN") && (
            <NavLink
              to="/admin"
              className={navClass}
            >
              Admin
            </NavLink>
          )}
        </nav>

        {/* ======================================
            DESKTOP ACCOUNT AREA
        ======================================= */}

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              {/* Profile / Account */}
              <Link
                to={profilePath}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <UserRound size={17} />

                <span className="max-w-[120px] truncate">
                  {user.name || "My Account"}
                </span>
              </Link>

              {/* Logout */}
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Login */}
              <Link
                to="/login"
                className="rounded-xl px-4 py-2.5 text-sm font-bold text-[#0066b3] transition hover:bg-blue-50"
              >
                Login
              </Link>

              {/* Register */}
              <Link
                to="/register"
                className="rounded-xl bg-[#0066b3] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#005493]"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* ======================================
            MOBILE MENU BUTTON
        ======================================= */}

        <button
          type="button"
          onClick={() =>
            setMobileOpen((value) => !value)
          }
          className="rounded-xl p-2 text-slate-700 transition hover:bg-slate-50 md:hidden"
          aria-label={
            mobileOpen
              ? "Close menu"
              : "Open menu"
          }
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <X size={23} />
          ) : (
            <Menu size={23} />
          )}
        </button>
      </div>

      {/* ========================================
          MOBILE NAVIGATION
      ========================================= */}

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-5 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            {/* Dashboard */}
            {user && (
              <Link
                to={dashboardPath}
                onClick={closeMobileMenu}
                className="rounded-xl bg-blue-50 px-4 py-3 font-bold text-[#0066b3]"
              >
                Dashboard
              </Link>
            )}

            {/* Find Jobs */}
            <Link
              to="/jobs"
              onClick={closeMobileMenu}
              className="rounded-xl px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Find Jobs
            </Link>

            {/* Companies */}
            <Link
              to="/companies"
              onClick={closeMobileMenu}
              className="rounded-xl px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Companies
            </Link>

            {/* Career Advice */}
            <Link
              to="/career-advice"
              onClick={closeMobileMenu}
              className="rounded-xl px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Career Advice
            </Link>

            {/* Recruiter */}
            {user?.role === "RECRUITER" && (
              <Link
                to="/recruiter"
                onClick={closeMobileMenu}
                className="rounded-xl px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Recruiter
              </Link>
            )}

            {/* Admin */}
            {(user?.role === "ADMIN" ||
              user?.role === "SUPER_ADMIN") && (
              <Link
                to="/admin"
                onClick={closeMobileMenu}
                className="rounded-xl px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Admin
              </Link>
            )}

            {/* Profile / Account */}
            {user && (
              <Link
                to={profilePath}
                onClick={closeMobileMenu}
                className="mt-2 flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <UserRound size={18} />

                {user.name || "My Account"}
              </Link>
            )}

            {/* Logout */}
            {user && (
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-left font-bold text-red-600 transition hover:bg-red-100"
              >
                Logout
              </button>
            )}

            {/* Login / Register */}
            {!user && (
              <>
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="mt-2 rounded-xl border border-slate-200 px-4 py-3 text-center font-bold text-[#0066b3]"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={closeMobileMenu}
                  className="rounded-xl bg-[#0066b3] px-4 py-3 text-center font-bold text-white"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}