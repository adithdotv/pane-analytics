"use client";

import { useState } from "react";

export default function CreateSiteForm({ onCreate, onCancel }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await onCreate(name.trim());
      setName("");
    } catch {
      setError("Couldn't create that site. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-xl border border-[#E4E9EF] bg-white p-8">
      <p className="text-[15px] font-medium text-[#1B2430] mb-1">Add a site</p>
      <p className="text-[13px] text-[#5B6B7C] mb-4">Give it a name to get a tracking snippet.</p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          required
          placeholder="My website"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 rounded-lg border border-[#E4E9EF] px-3 py-2 text-[14px] text-[#1B2430] outline-none focus:border-[#2E6FED]"
        />
        <button
          type="submit"
          disabled={isSubmitting || !name.trim()}
          className="rounded-lg bg-[#2E6FED] px-4 py-2 text-[14px] font-medium text-white disabled:opacity-60"
        >
          {isSubmitting ? "Adding…" : "Add"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="text-[13px] text-[#5B6B7C] px-2">
            Cancel
          </button>
        )}
      </form>
      {error && <p className="mt-2 text-[13px] text-[#D64545]">{error}</p>}
    </div>
  );
}
