"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import OrbitView from "@/components/group-b/OrbitView";
import StrangerCard from "@/components/group-b/StrangerCard";

type Stranger = {
  id: string;
  strangerUuid: string;
  nickname: string;
  encounterCount: number;
  status: string;
  chatUnlocked: boolean;
};

export default function OrbitPage() {
  const [strangers, setStrangers] = useState<Stranger[]>([]);
  const [uuid, setUuid] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const myUuid = localStorage.getItem("drift_uuid");
    if (!myUuid) {
      window.location.href = "/group-a";
      return;
    }
    setUuid(myUuid);

    fetch(`/api/group-b?uuid=${myUuid}`)
      .then((r) => r.json())
      .then((data) => {
        setStrangers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center px-4 pb-16">
      {/* Header */}
      <div className="flex w-full max-w-sm items-center justify-between py-6">
        <span className="text-sm font-bold tracking-widest text-[#F5ECD7]">drift</span>
        <Link
          href="/group-a/settings"
          className="text-xs text-[#6B5D4F] transition hover:text-[#9B8B6E]"
        >
          settings
        </Link>
      </div>

      {loading ? (
        <div className="mt-32 flex flex-col items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-[#C49A3C] animate-pulse" />
          <p className="text-xs text-[#6B5D4F]">scanning...</p>
        </div>
      ) : strangers.length === 0 ? (
        <div className="mt-24 flex flex-col items-center gap-6 text-center px-8">
          <div className="h-2 w-2 rounded-full bg-[#3D3047]" />
          <p className="text-sm text-[#9B8B6E] leading-relaxed">
            no familiar strangers yet.<br />
            drift notices patterns over time.
          </p>
          <Link
            href="/group-a/settings"
            className="text-xs text-[#C49A3C] underline"
          >
            seed demo data to see the full flow
          </Link>
        </div>
      ) : (
        <>
          {/* Orbit visualization */}
          <OrbitView strangers={strangers} />

          {/* Stranger list */}
          <div className="flex w-full max-w-sm flex-col gap-2 mt-4">
            <p className="text-xs tracking-widest text-[#6B5D4F] uppercase mb-1">
              {strangers.length} familiar {strangers.length === 1 ? "stranger" : "strangers"}
            </p>
            {strangers.map((s) => (
              <StrangerCard key={s.id} {...s} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
