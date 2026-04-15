"use client";

import Link from "next/link";

type Props = {
  id: string;
  strangerUuid: string;
  nickname: string;
  encounterCount: number;
  status: string;
  chatUnlocked: boolean;
};

const STATUS_STYLE: Record<string, { dot: string; badge: string; text: string }> = {
  "Almost Known": {
    dot:   "bg-[#C49A3C] shadow-[0_0_8px_#C49A3C]",
    badge: "border-[#C49A3C]/40 text-[#C49A3C]",
    text:  "Almost Known",
  },
  "Silhouette": {
    dot:   "bg-[#8B5CF6] shadow-[0_0_8px_#8B5CF6]",
    badge: "border-[#8B5CF6]/40 text-[#8B5CF6]",
    text:  "Silhouette",
  },
  "Shadow": {
    dot:   "bg-[#3D3047]",
    badge: "border-[#3D3047] text-[#6B5D4F]",
    text:  "Shadow",
  },
};

export default function StrangerCard({ strangerUuid, nickname, encounterCount, status, chatUnlocked }: Props) {
  const style = STATUS_STYLE[status] ?? STATUS_STYLE["Shadow"];
  const emoji = nickname.split(" ").at(-1) ?? "";
  const name  = nickname.split(" ").slice(0, -1).join(" ");

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-[#2A1F3D] bg-[#130E1E] px-5 py-4">
      {/* Status dot */}
      <div className={`h-2.5 w-2.5 shrink-0 rounded-full ${style.dot}`} />

      {/* Info */}
      <div className="flex flex-1 flex-col gap-0.5 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[#F5ECD7] truncate">{name}</span>
          <span className="text-sm">{emoji}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#6B5D4F]">{encounterCount} crossings</span>
          <span className={`rounded border px-1.5 py-0.5 text-[10px] tracking-wide ${style.badge}`}>
            {style.text}
          </span>
        </div>
      </div>

      {/* Chat button */}
      {chatUnlocked ? (
        <Link
          href={`/group-c?strangerUuid=${strangerUuid}`}
          className="shrink-0 rounded-xl border border-[#2A1F3D] px-3 py-1.5 text-xs text-[#9B8B6E] transition hover:border-[#C49A3C] hover:text-[#C49A3C]"
        >
          chat
        </Link>
      ) : (
        <span className="shrink-0 text-[10px] text-[#3D3047]">
          {5 - encounterCount} more
        </span>
      )}
    </div>
  );
}
