import { useState } from "react";
import { ArrowLeft, BriefcaseBusiness, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim() }),
        },
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Unable to request an OTP.");
      }

      sessionStorage.setItem("password_reset_email", email.trim());
      toast.success(data.message || "OTP request submitted.");

      navigate("/verify-otp", {
        state: { email: email.trim() },
      });
    } catch (error) {
      toast.error(
        error.message === "Failed to fetch"
          ? "Cannot connect to the server. Please check your API configuration."
          : error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-[#f6f8fb] px-4 py-10">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_25px_80px_rgba(15,60,100,0.10)] sm:p-10">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#0066b3]"
        >
          <ArrowLeft size={16} />
          Back to sign in
        </Link>

        <div className="mt-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf4fc] text-[#0066b3]">
          <BriefcaseBusiness size={27} />
        </div>

        <p className="mt-7 text-xs font-extrabold uppercase tracking-[0.18em] text-[#0066b3]">
          Account recovery
        </p>

        <h1 className="mt-2 text-3xl font-black tracking-tight text-[#172b4d]">
          Forgot password?
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          Enter the email address associated with your account.
          If supported by the server, we’ll send you a verification
          code to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="recovery-email"
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
                id="recovery-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none transition focus:border-[#0066b3] focus:bg-white focus:ring-2 focus:ring-[#0066b3]/10"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-xl bg-[#0066b3] text-sm font-extrabold text-white transition hover:bg-[#005493] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Please wait..." : "Send verification code"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs leading-5 text-slate-400">
          For your security, only use an email address associated
          with your account.
        </p>
      </section>
    </main>
  );
}
