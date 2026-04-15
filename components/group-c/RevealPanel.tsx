"use client";

import { useEffect, useState } from "react";

type Props = {
  chatId: string;
  myUuid: string;
  myRevealed: boolean;
  theyRevealed: boolean;
  bothRevealed: boolean;
  strangerName: string | null;
  encounterCount: number;
  onReveal: () => void;
};

export default function RevealPanel({
  chatId,
  myUuid,
  myRevealed,
  theyRevealed,
  bothRevealed,
  strangerName,
  encounterCount,
  onReveal,
}: Props) {
  const [revealing, setRevealing] = useState(false);
  const [showIcebreaker, setShowIcebreaker] = useState(false);

  // Trigger icebreaker animation when both reveal
  useEffect(() => {
    if (bothRevealed) {
      const t = setTimeout(() => setShowIcebreaker(true), 800);
      return () => clearTimeout(t);
    }
  }, [bothRevealed]);

  async function handleReveal() {
    setRevealing(true);
    await fetch(`/api/group-c/${chatId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ myUuid }),
    });
    setRevealing(false);
    onReveal();
  }

  if (bothRevealed && strangerName) {
    return (
      <div className="flex flex-col items-center gap-3 border-t border-[#1A1228] px-6 py-5 text-center">
        {/* Revealed name fades in */}
        <p
          className="text-base font-semibold text-[#F5ECD7] transition-opacity duration-700"
          style={{ opacity: 1 }}
        >
          {strangerName}
        </p>

        {/* Icebreaker drops in after a beat */}
        <p
          className="text-xs text-[#9B8B6E] leading-relaxed transition-all duration-1000"
          style={{
            opacity: showIcebreaker ? 1 : 0,
            transform: showIcebreaker ? "translateY(0)" : "translateY(6px)",
          }}
        >
          you&apos;ve crossed paths {encounterCount} times.<br />
          looks like you&apos;re both regulars.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 border-t border-[#1A1228] px-6 py-4">
      {!myRevealed ? (
        <>
          <button
            onClick={handleReveal}
            disabled={revealing}
            className="rounded-xl border border-[#C49A3C]/50 px-5 py-2 text-xs tracking-wide text-[#C49A3C] transition hover:bg-[#C49A3C]/10 disabled:opacity-40"
          >
            {revealing ? "revealing..." : "reveal yourself"}
          </button>
          <p className="text-[10px] text-[#4A3F35]">
            mutual — they need to reveal too
          </p>
        </>
      ) : (
        <p className="text-xs text-[#6B5D4F]">
          {theyRevealed ? "both revealed — loading..." : "waiting for them to reveal..."}
        </p>
      )}
    </div>
  );
}
