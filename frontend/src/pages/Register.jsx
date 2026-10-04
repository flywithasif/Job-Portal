import { useState } from "react";
import {
  BriefcaseBusiness,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "JOB_SEEKER",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const name = form.name.trim();
    const email = form.email.trim();

    if (!name || !email) {
      toast.error("Please enter your name and email.");
      return;
    }

    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (form.role !== "JOB_SEEKER") {
      toast.error(
        "Recruiter registration requires backend support."
      );
      return;
    }

    try {
      setLoading(true);

      const user = await register({
        name,
        email,
        password: form.password,
        role: form.role,
      });

      toast.success("Account created successfully!");

      navigate(
        user.role === "RECRUITER"
          ? "/recruiter"
          : "/dashboard",
        { replace: true }
      );
    } catch (error) {
      toast.error(error.message || "Unable to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-72px)] bg-[#f6f8fb] px-4 py-10 sm:py-12">
      <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_25px_80px_rgba(15,60,100,0.08)] sm:p-10">
        {/* Brand */}
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0066b3] text-white">
            <BriefcaseBusiness size={25} />
          </div>
        </div>

        {/* Heading */}
        <div className="mt-6 text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#0066b3]">
            Get started
          </p>

          <h1 className="mt-2 text-3xl font-black text-[#172b4d]">
            Create your account
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Join professionals and companies growing with CareerFlow.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {/* Account type */}
          <fieldset>
            <legend className="text-sm font-bold text-slate-700">
              I am
            </legend>

            <div className="mt-2 grid grid-cols-2 gap-3">
              {[
                ["JOB_SEEKER", "Job Seeker"],
                ["RECRUITER", "Recruiter"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={form.role === value}
                  onClick={() =>
                    setForm((previous) => ({
                      ...previous,
                      role: value,
                    }))
                  }
                  className={`rounded-xl border px-4 py-3 text-sm font-bold transition ${
                    form.role === value
                      ? "border-[#0066b3] bg-blue-50 text-[#0066b3]"
                      : "border-slate-200 text-slate-600 hover:border-blue-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {form.role === "RECRUITER" && (
              <p className="mt-2 text-xs leading-5 text-amber-700">
                Recruiter account creation will be available after
                backend registration is connected.
              </p>
            )}
          </fieldset>

          {/* Full name */}
          <div>
            <label
              htmlFor="register-name"
              className="text-sm font-bold text-slate-700"
            >
              Full name
            </label>

            <div className="relative mt-2">
              <UserRound
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="register-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                maxLength={100}
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none transition focus:border-[#0066b3] focus:bg-white"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="register-email"
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
                id="register-email"
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
              htmlFor="register-password"
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
                id="register-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                minLength={8}
                required
                value={form.password}
                onChange={handleChange}
                placeholder="Minimum 8 characters"
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-12 text-sm outline-none transition focus:border-[#0066b3] focus:bg-white"
              />

              <button
                type="button"
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
                onClick={() =>
                  setShowPassword((previous) => !previous)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0066b3]"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            <p className="mt-2 text-xs text-slate-500">
              Use at least 8 characters.
            </p>
          </div>

          {/* Confirm password */}
          <div>
            <label
              htmlFor="register-confirm-password"
              className="text-sm font-bold text-slate-700"
            >
              Confirm password
            </label>

            <div className="relative mt-2">
              <LockKeyhole
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="register-confirm-password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-12 text-sm outline-none transition focus:border-[#0066b3] focus:bg-white"
              />

              <button
                type="button"
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
                onClick={() =>
                  setShowConfirmPassword((previous) => !previous)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0066b3]"
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-xl bg-[#0066b3] text-sm font-extrabold text-white transition hover:bg-[#005493] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {/* Login link */}
        <p className="mt-7 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold text-[#0066b3] hover:text-[#005493]"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
