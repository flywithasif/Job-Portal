import { useState } from "react";
import { BriefcaseBusiness } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "JOB_SEEKER",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    try {
      setLoading(true);

      const user = await register(form);

      toast.success("Account created successfully!");

      if (user.role === "RECRUITER") {
        navigate("/recruiter");
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
      <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_25px_80px_rgba(15,60,100,0.08)] sm:p-10">
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0066b3] text-white">
            <BriefcaseBusiness />
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#0066b3]">
            Get started
          </p>

          <h1 className="mt-2 text-3xl font-black text-[#172b4d]">
            Create your account
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Join professionals and companies growing with CareerFlow.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >
          <div>
            <label className="text-sm font-bold text-slate-700">
              I am
            </label>

            <div className="mt-2 grid grid-cols-2 gap-3">
              {[
                ["JOB_SEEKER", "Job Seeker"],
                ["RECRUITER", "Recruiter"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      role: value,
                    })
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
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700">
              Full name
            </label>

            <input
              required
              value={form.name}
              onChange={(event) =>
                setForm({
                  ...form,
                  name: event.target.value,
                })
              }
              placeholder="Your full name"
              className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-[#0066b3] focus:bg-white"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700">
              Email address
            </label>

            <input
              required
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm({
                  ...form,
                  email: event.target.value,
                })
              }
              placeholder="you@example.com"
              className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-[#0066b3] focus:bg-white"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700">
              Password
            </label>

            <input
              required
              type="password"
              minLength={8}
              value={form.password}
              onChange={(event) =>
                setForm({
                  ...form,
                  password: event.target.value,
                })
              }
              placeholder="Minimum 8 characters"
              className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-[#0066b3] focus:bg-white"
            />
          </div>

          <button
            disabled={loading}
            className="h-12 w-full rounded-xl bg-[#0066b3] text-sm font-extrabold text-white transition hover:bg-[#005493] disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold text-[#0066b3]"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
