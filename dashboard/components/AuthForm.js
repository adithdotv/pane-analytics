"use client";

import { useEffect, useState } from "react";

import { formatApiError, requestOtp, verifyOtp } from "@/lib/api";

const RESEND_COOLDOWN_SECONDS = 60;

export default function AuthForm({ onVerified }) {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((current) => current - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  async function handleEmailSubmit(e) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await requestOtp(email);
      setStep("code");
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCodeSubmit(e) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await verifyOtp(email, code);
      await onVerified();
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResend() {
    setError("");
    try {
      await requestOtp(email);
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      setError(formatApiError(err));
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F9FB] flex items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-xl border border-[#E4E9EF] bg-white p-8">
        {step === "email" ? (
          <>
            <p className="font-[family-name:var(--font-display)] text-[19px] font-medium text-[#1B2430] mb-2">
              Continue with your email
            </p>
            <p className="text-[13px] text-[#5B6B7C] mb-6">
              We&apos;ll email you a 6-digit code. No password needed.
            </p>
            <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5 text-[13px] text-[#5B6B7C]">
                Email
                <input
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-lg border border-[#E4E9EF] px-3 py-2 text-[14px] text-[#1B2430] outline-none focus:border-[#2E6FED]"
                />
              </label>
              {error && <p className="text-[13px] text-[#D64545]">{error}</p>}
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-[#2E6FED] px-4 py-2.5 text-[14px] font-medium text-white disabled:opacity-60"
              >
                {isSubmitting ? "…" : "Send code"}
              </button>
            </form>
          </>
        ) : (
          <>
            <p className="font-[family-name:var(--font-display)] text-[19px] font-medium text-[#1B2430] mb-2">
              Enter your code
            </p>
            <p className="text-[13px] text-[#5B6B7C] mb-6">
              We sent a 6-digit code to <span className="text-[#1B2430]">{email}</span>.
            </p>
            <form onSubmit={handleCodeSubmit} className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5 text-[13px] text-[#5B6B7C]">
                Code
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="\d{6}"
                  maxLength={6}
                  required
                  autoFocus
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  className="rounded-lg border border-[#E4E9EF] px-3 py-2 text-[14px] tracking-[0.3em] text-[#1B2430] outline-none focus:border-[#2E6FED]"
                />
              </label>
              {error && <p className="text-[13px] text-[#D64545]">{error}</p>}
              <button
                type="submit"
                disabled={isSubmitting || code.length !== 6}
                className="rounded-lg bg-[#2E6FED] px-4 py-2.5 text-[14px] font-medium text-white disabled:opacity-60"
              >
                {isSubmitting ? "…" : "Verify and continue"}
              </button>
            </form>
            <div className="mt-6 flex items-center justify-between text-[13px] text-[#5B6B7C]">
              <button
                type="button"
                onClick={() => {
                  setStep("email");
                  setCode("");
                  setError("");
                }}
              >
                ← Use a different email
              </button>
              <button
                type="button"
                onClick={handleResend}
                disabled={cooldown > 0}
                className="disabled:opacity-60"
              >
                {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
