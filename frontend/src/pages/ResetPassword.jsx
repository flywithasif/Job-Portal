import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Eye,
  EyeOff,
  LockKeyhole,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const resetToken = sessionStorage.getItem("password_reset_token");

  useEffect(() => {
    if (!resetToken) {
      navigate("/forgot-password", { replace: true });
    }
  }, [resetToken, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            resetToken,
            password,
            confirmPassword,
          }),
        },
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Could not reset password.");
      }

      sessionStorage.removeItem("password_reset_token");
      sessionStorage.removeItem("password_reset_email");

      toast.success(data.message || "Password reset successfully.");

      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(
        error.message === "Failed to fetch"
          ? "Cannot connect to the server. Check your API configuration."
          : error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  if (!resetToken) return null;

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
          Secure your account
        </p>

        <h1 className="mt-2 text-3xl font-black tracking-tight text-[#172b4d]">
          Create new password
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          Choose a strong password with at least 8 characters.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="new-password"
              className="text-sm font-bold text-slate-700"
            >
              New password
            </label>

            <div className="relative mt-2">
              <LockKeyhole
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="new-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                minLength={8}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter new password"
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-12 text-sm outline-none transition focus:border-[#0066b3] focus:bg-white focus:ring-2 focus:ring-[#0066b3]/10"
              />

              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0066b3]"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="text-sm font-bold text-slate-700"
            >
              Confirm new password
            </label>

            <div className="relative mt-2">
              <LockKeyhole
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                placeholder="Re-enter new password"
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-12 text-sm outline-none transition focus:border-[#0066b3] focus:bg-white focus:ring-2 focus:ring-[#0066b3]/10"
              />

              <button
                type="button"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
                onClick={() =>
                  setShowConfirmPassword((value) => !value)
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

          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-xl bg-[#0066b3] text-sm font-extrabold text-white transition hover:bg-[#005493] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Updating password..." : "Reset Password"}
          </button>
        </form>
      </section>
    </main>
  );
}
