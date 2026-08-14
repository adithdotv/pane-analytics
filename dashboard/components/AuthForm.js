"use client";

import { useState } from "react";

import { formatApiError } from "@/lib/api";

export default function AuthForm({ title, submitLabel, onSubmit, footer }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await onSubmit(email, password);
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F9FB] flex items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-xl border border-[#E4E9EF] bg-white p-8">
        <p className="font-[family-name:var(--font-display)] text-[19px] font-medium text-[#1B2430] mb-6">
          {title}
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-[13px] text-[#5B6B7C]">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-[#E4E9EF] px-3 py-2 text-[14px] text-[#1B2430] outline-none focus:border-[#2E6FED]"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-[13px] text-[#5B6B7C]">
            Password
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg border border-[#E4E9EF] px-3 py-2 text-[14px] text-[#1B2430] outline-none focus:border-[#2E6FED]"
            />
          </label>
          {error && <p className="text-[13px] text-[#D64545]">{error}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-[#2E6FED] px-4 py-2.5 text-[14px] font-medium text-white disabled:opacity-60"
          >
            {isSubmitting ? "…" : submitLabel}
          </button>
        </form>
        {footer}
      </div>
    </div>
  );
}
