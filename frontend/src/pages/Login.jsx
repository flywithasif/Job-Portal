import { useState } from "react";
import { BriefcaseBusiness, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "JOB_SEEKER",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);

      const user = await login(form);

      toast.success("Welcome back!");

      if (user.role === "RECRUITER") {
        navigate("/recruiter");
      } else if (user.role === "SUPER_ADMIN") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-72px)] bg-[#f6f8fb] px-4 py-12">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_25px_80px_rgba(15,60,100,0.1)] lg:grid-cols-2">
        <div className="hidden bg-[#10243e] p-10 text-white lg:block">
          <div className="flex h-full flex-col justify-between">
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0066b3]">
                <BriefcaseBusiness />
              </div>

              <h1 className="mt-10 text-4xl font-black leading-tight">
                Your next opportunity is closer than you think.
              </h1>

              <p className="mt-5 leading-7 text-slate-300">
                Discover jobs, build your profile and manage your career
                journey from one modern platform.
              </p>
            </div>

            <p className="text-xs font-semibold text-slate-400">
              Trusted career platform for professionals and employers.
            </p>
          </div>
        </div>

        <div className="p-7 sm:p-10">
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
            <div>
              <label className="text-sm font-bold text-slate-700">
                Account type
              </label>

              <select
                value={form.role}
                onChange={(event) =>
                  setForm({
                    ...form,
                    role: event.target.value,
                  })
                }
                className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#0066b3]"
              >
                <option value="JOB_SEEKER">Job Seeker</option>
                <option value="RECRUITER">Recruiter</option>
                <option value="SUPER_ADMIN">Admin Demo</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700">
                Email
              </label>

              <input
                type="email"
                required
                value={form.email}
                onChange={(event) =>
                  setForm({
                    ...form,
                    email: event.target.value,
                  })
                }
                placeholder="you@example.com"
                className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition focus:border-[#0066b3] focus:bg-white"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700">
                Password
              </label>

              <div className="relative mt-2">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      password: event.target.value,
                    })
                  }
                  placeholder="Enter password"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 pr-12 text-sm outline-none transition focus:border-[#0066b3] focus:bg-white"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((value) => !value)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <button
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
              className="font-bold text-[#0066b3]"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
