"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPanel() {
  const router = useRouter();
  const [uuid, setUuid] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [bleEnabled, setBleEnabled] = useState(true);
  const [copied, setCopied] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seedDone, setSeedDone] = useState(false);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    setUuid(localStorage.getItem("drift_uuid"));
    setDisplayName(localStorage.getItem("drift_name"));

    // Fetch current BLE setting from DB
    const storedUuid = localStorage.getItem("drift_uuid");
    if (storedUuid) {
      fetch(`/api/group-a?uuid=${storedUuid}`)
        .then((r) => r.json())
        .then((u) => setBleEnabled(u.bleEnabled ?? true))
        .catch(() => {});
    }
  }, []);

  async function toggleBle() {
    if (!uuid) return;
    const next = !bleEnabled;
    setBleEnabled(next);
    await fetch("/api/group-a", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uuid, bleEnabled: next }),
    });
  }

  async function copyUuid() {
    if (!uuid) return;
    await navigator.clipboard.writeText(uuid);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function seedDemo() {
    if (!uuid) return;
    setSeeding(true);
    setSeedDone(false);
    await fetch("/api/group-a/seed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ myUuid: uuid }),
    });
    setSeeding(false);
    setSeedDone(true);
  }

  async function clearData() {
    if (!uuid) return;
    setClearing(true);
    await fetch(`/api/group-a?uuid=${uuid}`, { method: "DELETE" });
    localStorage.removeItem("drift_uuid");
    localStorage.removeItem("drift_name");
    router.push("/group-a");
  }

  if (!uuid) {
    return (
      <p className="text-sm text-[#9B8B6E]">
        No identity found.{" "}
        <a href="/group-a" className="underline text-[#C49A3C]">
          Start onboarding
        </a>
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-sm">
      {/* Identity */}
      <section className="flex flex-col gap-3 rounded-2xl border border-[#2A1F3D] bg-[#130E1E] p-5">
        <h2 className="text-xs tracking-widest text-[#9B8B6E] uppercase">Your Identity</h2>
        <div className="flex flex-col gap-1">
          <span className="text-base font-semibold text-[#F5ECD7]">{displayName}</span>
          <button
            onClick={copyUuid}
            className="flex items-center gap-2 text-left"
          >
            <span className="font-mono text-xs text-[#4A3F35] truncate max-w-[220px]">{uuid}</span>
            <span className="text-xs text-[#C49A3C] shrink-0">{copied ? "copied!" : "copy"}</span>
          </button>
        </div>
      </section>

      {/* BLE Toggle */}
      <section className="flex items-center justify-between rounded-2xl border border-[#2A1F3D] bg-[#130E1E] p-5">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-sm font-semibold text-[#F5ECD7]">Bluetooth scanning</h2>
          <p className="text-xs text-[#6B5D4F]">detect nearby drifters</p>
        </div>
        <button
          onClick={toggleBle}
          className={`relative h-6 w-11 rounded-full transition-colors ${
            bleEnabled ? "bg-[#C49A3C]" : "bg-[#2A1F3D]"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-[#0B0910] transition-transform ${
              bleEnabled ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </section>

      {/* Seed Demo Data */}
      <section className="flex flex-col gap-3 rounded-2xl border border-[#2A1F3D] bg-[#130E1E] p-5">
        <h2 className="text-xs tracking-widest text-[#9B8B6E] uppercase">Demo Setup</h2>
        <p className="text-xs text-[#6B5D4F]">
          Seeds 4 familiar strangers at different encounter stages so you can demo the full flow.
        </p>
        <button
          onClick={seedDemo}
          disabled={seeding}
          className="rounded-xl border border-[#8B5CF6] px-4 py-2 text-sm text-[#8B5CF6] transition hover:bg-[#8B5CF6] hover:text-white disabled:opacity-40"
        >
          {seeding ? "seeding..." : seedDone ? "seeded — go to orbit" : "seed demo data"}
        </button>
        {seedDone && (
          <a href="/group-b" className="text-center text-xs text-[#C49A3C] underline">
            open orbit screen
          </a>
        )}
      </section>

      {/* Clear Data */}
      <section className="flex flex-col gap-3 rounded-2xl border border-[#3D1F1F] bg-[#130E1E] p-5">
        <h2 className="text-xs tracking-widest text-[#9B3C3C] uppercase">Danger Zone</h2>
        <button
          onClick={clearData}
          disabled={clearing}
          className="rounded-xl border border-[#9B3C3C] px-4 py-2 text-sm text-[#9B3C3C] transition hover:bg-[#9B3C3C] hover:text-white disabled:opacity-40"
        >
          {clearing ? "clearing..." : "clear all data"}
        </button>
      </section>
    </div>
  );
}
