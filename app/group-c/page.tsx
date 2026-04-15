"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

type Chat = {
  id: string;
  strangerUuid: string;
  revealedByA: boolean;
  revealedByB: boolean;
  participantAUuid: string;
  participantBUuid: string;
  lastMessage: { content: string; senderUuid: string } | null;
  createdAt: string;
};

export default function ChatListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const strangerUuid = searchParams.get("strangerUuid");

  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const myUuid = localStorage.getItem("drift_uuid");
    if (!myUuid) { router.replace("/group-a"); return; }

    // If coming from orbit with a strangerUuid, find or create the chat then redirect
    if (strangerUuid) {
      fetch("/api/group-c", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ myUuid, strangerUuid }),
      })
        .then((r) => r.json())
        .then(({ chatId }) => router.replace(`/group-c/${chatId}`))
        .catch(() => router.replace("/group-b"));
      return;
    }

    // Otherwise show chat list
    fetch(`/api/group-c?myUuid=${myUuid}`)
      .then((r) => r.json())
      .then((data) => { setChats(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [strangerUuid, router]);

  if (strangerUuid) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="h-2 w-2 rounded-full bg-[#C49A3C] animate-pulse" />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col px-4 pb-16">
      <div className="flex w-full max-w-sm mx-auto items-center justify-between py-6">
        <Link href="/group-b" className="text-xs text-[#6B5D4F] hover:text-[#9B8B6E] transition">orbit</Link>
        <span className="text-sm font-semibold tracking-widest text-[#F5ECD7]">messages</span>
        <span className="w-10" />
      </div>

      <div className="w-full max-w-sm mx-auto flex flex-col gap-2">
        {loading ? (
          <div className="mt-24 flex justify-center">
            <div className="h-2 w-2 rounded-full bg-[#C49A3C] animate-pulse" />
          </div>
        ) : chats.length === 0 ? (
          <div className="mt-24 flex flex-col items-center gap-4 text-center">
            <p className="text-sm text-[#9B8B6E]">no chats yet</p>
            <Link href="/group-b" className="text-xs text-[#C49A3C] underline">go to orbit</Link>
          </div>
        ) : (
          chats.map((c) => (
            <Link
              key={c.id}
              href={`/group-c/${c.id}`}
              className="flex items-center gap-4 rounded-2xl border border-[#2A1F3D] bg-[#130E1E] px-5 py-4 transition hover:border-[#C49A3C]/40"
            >
              <div className="h-2 w-2 shrink-0 rounded-full bg-[#8B5CF6]" />
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-xs font-mono text-[#6B5D4F] truncate">{c.strangerUuid.slice(0, 8)}…</span>
                {c.lastMessage && (
                  <span className="text-xs text-[#4A3F35] truncate">{c.lastMessage.content}</span>
                )}
              </div>
            </Link>
          ))
        )}
      </div>
    </main>
  );
}
