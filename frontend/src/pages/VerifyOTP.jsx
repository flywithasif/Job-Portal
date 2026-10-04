import { useEffect, useRef, useState } from "react";
import { ArrowLeft, BriefcaseBusiness, ShieldCheck } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

export default function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const inputRefs = useRef([]);

  const email =
    location.state?.email ||
    sessionStorage.getItem("password_reset_email") ||
    "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password", { replace: true });
    }
  }, [email, navigate]);

  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);

    setOtp((previous) =>
      previous.map((item, itemIndex) =>
        itemIndex === index ? digit : item,
      ),
    );

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pasted) return;

    event.preventDefault();

    setOtp(Array.from({ length: 6 }, (_, index) => pasted[index] || ""));

    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleVerify = async (event) => {
    event.preventDefault();

    const code = otp.join("");

    if (code.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/auth/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp: code }),
        },
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "OTP verification failed.");
      }

      // The backend must issue this token after successful verification.
      if (!data.resetToken) {
        throw new Error(
          "Server did not return a password reset token. Check the verify-OTP API response.",
        );
      }

      sessionStorage.setItem("password_reset_token", data.resetToken);

      toast.success("OTP verified successfully.");

      navigate("/reset-password", { replace: true });
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

  const handleResend = async () => {
    if (!email) return;

    try {
      setResending(true);

      const response = await fetch(
        `${API_BASE_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Could not resend OTP.");
      }

      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();

      toast.success(data.message || "OTP resend request submitted.");
    } catch (error) {
      toast.error(
        error.message === "Failed to fetch"
          ? "Cannot connect to the server."
          : error.message,
      );
    } finally {
      setResending(false);
    }
  };

  if (!email) return null;

  return (
    <main className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-[#f6f8fb] px-4 py-10">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_25px_80px_rgba(15,60,100,0.10)] sm:p-10">
        <Link
          to="/forgot-password"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#0066b3]"
        >
          <ArrowLeft size={16} />
          Change email
        </Link>

        <div className="mt-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eaf4fc] text-[#0066b3]">
          <ShieldCheck size={28} />
        </div>

        <p className="mt-7 text-xs font-extrabold uppercase tracking-[0.18em] text-[#0066b3]">
          Email verification
        </p>

        <h1 className="mt-2 text-3xl font-black tracking-tight text-[#172b4d]">
          Verify your code
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          Enter the 6-digit code sent to{" "}
          <span className="font-bold text-slate-700">{email}</span>.
        </p>

        <form onSubmit={handleVerify} className="mt-8">
          <label className="text-sm font-bold text-slate-700">
            Verification code
          </label>

          <div
            className="mt-3 grid grid-cols-6 gap-2 sm:gap-3"
            onPaste={handlePaste}
          >
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(element) => {
                  inputRefs.current[index] = element;
                }}
                type="text"
                inputMode="numeric"
                autoComplete={index === 0 ? "one-time-code" : "off"}
                aria-label={`OTP digit ${index + 1}`}
                maxLength={1}
                value={digit}
                onChange={(event) =>
                  handleOtpChange(index, event.target.value)
                }
                onKeyDown={(event) => handleKeyDown(index, event)}
                className="h-12 min-w-0 rounded-xl border border-slate-200 bg-slate-50 text-center text-lg font-extrabold text-[#172b4d] outline-none transition focus:border-[#0066b3] focus:bg-white focus:ring-2 focus:ring-[#0066b3]/10"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-7 h-12 w-full rounded-xl bg-[#0066b3] text-sm font-extrabold text-white transition hover:bg-[#005493] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          Didn't receive the code?{" "}
          <button
            type="button"
            disabled={resending}
            onClick={handleResend}
            className="font-bold text-[#0066b3] hover:text-[#005493] disabled:opacity-60"
          >
            {resending ? "Sending..." : "Resend OTP"}
          </button>
        </div>
      </section>
    </main>
  );
}
