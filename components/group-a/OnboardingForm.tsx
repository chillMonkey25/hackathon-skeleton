"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/group-a", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName: name.trim() }),
      });

      if (!res.ok) throw new Error("Failed to create user");

      const user = await res.json();
      localStorage.setItem("drift_uuid", user.uuid);
      localStorage.setItem("drift_name", user.displayName);

      router.push("/group-b");
    } catch {
      setError("Something went wrong. Try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-sm">
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-xs tracking-widest text-[#9B8B6E] uppercase">
          what should we call you?
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="a name, a nickname, anything"
          maxLength={32}
          className="rounded-xl border border-[#2A1F3D] bg-[#130E1E] px-4 py-3 text-[#F5ECD7] placeholder-[#4A3F35] outline-none transition focus:border-[#C49A3C] focus:ring-0"
          autoFocus
        />
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={loading || !name.trim()}
        className="rounded-xl bg-[#C49A3C] px-6 py-3 text-sm font-semibold tracking-wide text-[#0B0910] transition hover:bg-[#D4AA4C] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? "entering the drift..." : "start drifting"}
      </button>

      <p className="text-center text-xs text-[#4A3F35]">
        anonymous by default — your name only appears when you choose to reveal
      </p>
    </form>
  );
}
