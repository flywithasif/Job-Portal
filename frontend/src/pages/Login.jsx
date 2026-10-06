import { useState } from "react";

import {
  BriefcaseBusiness,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

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
  });

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // GET ROLE DEFAULT PATH
  // ==========================================

  const getDefaultPath = (role) => {
    if (
      role === "SUPER_ADMIN" ||
      role === "ADMIN"
    ) {
      return "/admin";
    }

    if (role === "RECRUITER") {
      return "/recruiter";
    }

    if (role === "JOB_SEEKER") {
      return "/dashboard";
    }

    return null;
  };

  // ==========================================
  // CHECK REQUESTED PATH
  // ==========================================

  const getAllowedRequestedPath = (role) => {
    const requestedPath =
      location.state?.from?.pathname;

    if (!requestedPath) {
      return null;
    }

    // ----------------------------------------
    // ADMIN
    // ----------------------------------------

    if (
      (role === "SUPER_ADMIN" ||
        role === "ADMIN") &&
      requestedPath.startsWith("/admin")
    ) {
      return requestedPath;
    }

    // ----------------------------------------
    // RECRUITER
    // ----------------------------------------

    if (
      role === "RECRUITER" &&
      requestedPath.startsWith("/recruiter")
    ) {
      return requestedPath;
    }

    // ----------------------------------------
    // JOB SEEKER
    // ----------------------------------------

    if (role === "JOB_SEEKER") {
      const allowedPrefixes = [
        "/dashboard",
        "/profile",
        "/saved-jobs",
        "/applied-jobs",
        "/applications/",
        "/notifications",
        "/interviews",
      ];

      const isAllowed = allowedPrefixes.some(
        (prefix) =>
          requestedPath === prefix ||
          requestedPath.startsWith(`${prefix}/`),
      );

      if (isAllowed) {
        return requestedPath;
      }
    }

    return null;
  };

  // ==========================================
  // HANDLE LOGIN
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    try {
      setLoading(true);

      // ========================================
      // REAL BACKEND LOGIN
      // ========================================
      //
      // Backend expects:
      // email
      // password
      //
      // Role is NOT trusted from frontend.
      //

      const response = await login({
        email: form.email.trim(),
        password: form.password,
      });

      // ========================================
      // GET AUTHENTICATED USER
      // ========================================
      //
      // AuthContext.login() already returns
      // the authenticated USER object directly.
      //
      // Example:
      // {
      //   _id: "...",
      //   name: "...",
      //   email: "...",
      //   role: "JOB_SEEKER"
      // }
      //

      const authenticatedUser = response;

      const role = String(
        authenticatedUser?.role || "",
      )
        .trim()
        .toUpperCase();

      // ========================================
      // ROLE VALIDATION
      // ========================================

      const defaultPath =
        getDefaultPath(role);

      if (!defaultPath) {
        toast.error(
          "Your account role could not be verified.",
        );

        return;
      }

      // ========================================
      // SAFE REDIRECT
      // ========================================

      const requestedPath =
        getAllowedRequestedPath(role);

      toast.success("Welcome back!");

      navigate(
        requestedPath || defaultPath,
        {
          replace: true,
        },
      );
    } catch (error) {
      // ========================================
      // BACKEND ERROR
      // ========================================

      const backendMessage =
        error?.response?.data?.message;

      const validationErrors =
        error?.response?.data?.errors;

      if (
        Array.isArray(validationErrors) &&
        validationErrors.length > 0
      ) {
        toast.error(
          validationErrors[0]?.message ||
            "Please check your login details.",
        );

        return;
      }

      toast.error(
        backendMessage ||
          error?.message ||
          "Unable to sign in. Please try again.",
      );
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
                Discover jobs, build your profile and
                manage your career journey from one
                modern platform.
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

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >
            {/* Email */}

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
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none transition focus:border-[#0066b3] focus:bg-white"
                />
              </div>
            </div>

            {/* Password */}

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
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="current-password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-12 text-sm outline-none transition focus:border-[#0066b3] focus:bg-white"
                />

                <button
                  type="button"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  onClick={() =>
                    setShowPassword(
                      (value) => !value,
                    )
                  }
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
                    setRememberMe(
                      event.target.checked,
                    )
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

            {/* Submit */}

            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-xl bg-[#0066b3] text-sm font-extrabold text-white transition hover:bg-[#005493] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Signing in..."
                : "Sign In"}
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