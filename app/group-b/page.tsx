"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

type LocationStatus = "waiting" | "granted" | "denied" | "unsupported";

const PING_INTERVAL_MS = 10_000; // ping location every 10 seconds

export default function OrbitPage() {
  const [strangers, setStrangers]           = useState<Stranger[]>([]);
  const [loading, setLoading]               = useState(true);
  const [locationStatus, setLocationStatus] = useState<LocationStatus>("waiting");
  const [nearbyCount, setNearbyCount]       = useState<number | null>(null);
  const uuidRef = useRef<string | null>(null);

  const fetchStrangers = useCallback(async (uuid: string) => {
    const res = await fetch(`/api/group-b?uuid=${uuid}`);
    if (!res.ok) return;
    const data = await res.json();
    setStrangers(Array.isArray(data) ? data : []);
  }, []);

  const pingLocation = useCallback(async (uuid: string) => {
    if (!navigator.geolocation) {
      setLocationStatus("unsupported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setLocationStatus("granted");
        const { latitude, longitude } = pos.coords;

        const res = await fetch("/api/group-b/location", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uuid, latitude, longitude }),
        });

        if (res.ok) {
          const data = await res.json();
          setNearbyCount(data.nearbyCount ?? 0);
          if (data.newEncounters > 0) {
            await fetchStrangers(uuid);
          }
        }
      },
      () => setLocationStatus("denied"),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 5000 }
    );
  }, [fetchStrangers]);

  useEffect(() => {
    const uuid = localStorage.getItem("drift_uuid");
    if (!uuid) { window.location.href = "/group-a"; return; }
    uuidRef.current = uuid;

    fetchStrangers(uuid).finally(() => setLoading(false));

    pingLocation(uuid);
    const interval = setInterval(() => pingLocation(uuid), PING_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchStrangers, pingLocation]);

  return (
    <main className="flex min-h-screen flex-col items-center px-4 pb-16">

      {/* Header */}
      <div className="flex w-full max-w-sm items-center justify-between py-6">
        <span className="text-sm font-bold tracking-widest text-[#F5ECD7]">drift</span>
        <div className="flex items-center gap-3">
          <LocationBadge status={locationStatus} nearbyCount={nearbyCount} />
          <Link href="/group-a/settings" className="text-xs text-[#6B5D4F] transition hover:text-[#9B8B6E]">
            settings
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="mt-32 flex flex-col items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-[#C49A3C] animate-pulse" />
          <p className="text-xs text-[#6B5D4F]">scanning...</p>
        </div>
      ) : strangers.length === 0 ? (
        <EmptyState locationStatus={locationStatus} />
      ) : (
        <>
          <OrbitView strangers={strangers} />
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

function LocationBadge({ status, nearbyCount }: { status: LocationStatus; nearbyCount: number | null }) {
  if (status === "waiting") {
    return <span className="text-[10px] text-[#4A3F35]">requesting location…</span>;
  }
  if (status === "denied" || status === "unsupported") {
    return (
      <span className="text-[10px] text-[#9B3C3C]">
        {status === "unsupported" ? "location unsupported" : "location off"}
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5 text-[10px] text-[#6B5D4F]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#C49A3C] animate-pulse" />
      {nearbyCount === null ? "scanning" : nearbyCount === 0 ? "no one nearby" : `${nearbyCount} nearby`}
    </span>
  );
}

function EmptyState({ locationStatus }: { locationStatus: LocationStatus }) {
  return (
    <div className="mt-24 flex flex-col items-center gap-5 text-center px-8">
      <div className="h-2 w-2 rounded-full bg-[#3D3047]" />
      {locationStatus === "denied" ? (
        <p className="text-sm text-[#9B8B6E] leading-relaxed">
          drift needs your location to detect nearby people.<br />
          enable it in your browser settings.
        </p>
      ) : (
        <>
          <p className="text-sm text-[#9B8B6E] leading-relaxed">
            no familiar strangers yet.<br />
            drift is scanning every 10 seconds.
          </p>
          <p className="text-xs text-[#4A3F35]">
            cross paths with someone 5+ times to unlock a chat.
          </p>
        </>
      )}
    </div>
  );
}
