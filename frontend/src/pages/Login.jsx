import { useState } from "react";
import {
  BriefcaseBusiness,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "JOB_SEEKER",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    try {
      setLoading(true);

      const user = await login({
        ...form,
        rememberMe,
      });

      // Read the actual role returned by the authentication system.
      const role = String(user?.role || "")
        .trim()
        .toUpperCase();

      let defaultPath;

      if (role === "SUPER_ADMIN" || role === "ADMIN") {
        defaultPath = "/admin";
      } else if (role === "RECRUITER") {
        defaultPath = "/recruiter";
      } else if (
        role === "JOB_SEEKER" ||
        role === "SEEKER"
      ) {
        defaultPath = "/dashboard";
      } else {
        toast.error(
          "Your account role could not be verified. Please check your login details."
        );
        return;
      }

      // Only allow a requested destination belonging to this role.
      const requestedPath = location.state?.from?.pathname;

      const allowedPath =
        requestedPath &&
        (
          (role === "SUPER_ADMIN" || role === "ADMIN") &&
          requestedPath.startsWith("/admin")
        ||
          role === "RECRUITER" &&
          requestedPath.startsWith("/recruiter")
        ||
          (role === "JOB_SEEKER" || role === "SEEKER") &&
          (
            requestedPath === "/dashboard" ||
            requestedPath.startsWith("/profile") ||
            requestedPath.startsWith("/saved-jobs") ||
            requestedPath.startsWith("/applied-jobs") ||
            requestedPath.startsWith("/applications/") ||
            requestedPath.startsWith("/notifications") ||
            requestedPath.startsWith("/interviews")
          )
        );

      toast.success("Welcome back!");

      navigate(allowedPath ? requestedPath : defaultPath, {
        replace: true,
      });
    } catch (error) {
      toast.error(error?.message || "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-72px)] bg-[#f6f8fb] px-4 py-10 sm:py-12">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_25px_80px_rgba(15,60,100,0.1)] lg:grid-cols-2">
        {/* Left promotional panel */}
        <section className="hidden bg-[#10243e] p-10 text-white lg:block">
          <div className="flex h-full flex-col justify-between">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0066b3]">
                <BriefcaseBusiness size={25} />
              </div>

              <h1 className="mt-10 text-4xl font-black leading-tight">
                Your next opportunity is closer than you think.
              </h1>

              <p className="mt-5 leading-7 text-slate-300">
                Discover jobs, build your profile and manage your
                career journey from one modern platform.
              </p>
            </div>

            <p className="text-xs font-semibold text-slate-400">
              Your career journey starts here.
            </p>
          </div>
        </section>

        {/* Login form */}
        <section className="p-6 sm:p-10">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#0066b3]">
              Welcome back
            </p>

            <h2 className="mt-2 text-2xl font-black text-[#172b4d]">
              Sign in to CareerFlow
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Continue your career journey.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="role"
                className="text-sm font-bold text-slate-700"
              >
                Account type
              </label>

              <select
                id="role"
                value={form.role}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    role: event.target.value,
                  }))
                }
                className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-[#0066b3] focus:ring-2 focus:ring-[#0066b3]/10"
              >
                <option value="JOB_SEEKER">Job Seeker</option>
                <option value="RECRUITER">Recruiter</option>
                <option value="SUPER_ADMIN">Admin Demo</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="email"
                className="text-sm font-bold text-slate-700"
              >
                Email address
              </label>

              <div className="relative mt-2">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      email: event.target.value,
                    }))
                  }
                  placeholder="you@example.com"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none transition focus:border-[#0066b3] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="text-sm font-bold text-slate-700"
              >
                Password
              </label>

              <div className="relative mt-2">
                <LockKeyhole
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={form.password}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      password: event.target.value,
                    }))
                  }
                  placeholder="Enter your password"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-12 text-sm outline-none transition focus:border-[#0066b3] focus:bg-white"
                />

                <button
                  type="button"
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-[#0066b3]"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me and forgot password */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) =>
                    setRememberMe(event.target.checked)
                  }
                  className="h-4 w-4 rounded border-slate-300 accent-[#0066b3]"
                />
                Remember me
              </label>

              <Link
                to="/forgot-password"
                className="text-sm font-bold text-[#0066b3] transition hover:text-[#005493]"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-xl bg-[#0066b3] text-sm font-extrabold text-white transition hover:bg-[#005493] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-bold text-[#0066b3] hover:text-[#005493]"
            >
              Create one
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
