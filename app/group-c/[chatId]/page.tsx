"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import ChatWindow from "@/components/group-c/ChatWindow";
import RevealPanel from "@/components/group-c/RevealPanel";

type ChatData = {
  strangerUuid: string;
  strangerName: string | null;
  myRevealed: boolean;
  theyRevealed: boolean;
  bothRevealed: boolean;
  encounterCount: number;
};

export default function ChatPage() {
  const params = useParams<{ chatId: string }>();
  const chatId = params.chatId;
  const router = useRouter();

  const [myUuid, setMyUuid] = useState<string | null>(null);
  const [chatData, setChatData] = useState<ChatData | null>(null);
  const [strangerNickname, setStrangerNickname] = useState("Anonymous");

  const fetchChatData = useCallback(async (uuid: string) => {
    const res = await fetch(`/api/group-c/${chatId}?myUuid=${uuid}`);
    if (!res.ok) return;
    const data = await res.json();
    setChatData({
      strangerUuid: data.strangerUuid,
      strangerName: data.strangerName,
      myRevealed: data.myRevealed,
      theyRevealed: data.theyRevealed,
      bothRevealed: data.bothRevealed,
      encounterCount: data.encounterCount,
    });
  }, [chatId]);

  useEffect(() => {
    const uuid = localStorage.getItem("drift_uuid");
    if (!uuid) { router.replace("/group-a"); return; }
    setMyUuid(uuid);
    fetchChatData(uuid);

    // Try to get the stranger's nickname from FamiliarStranger via orbit API
    // (read-only lookup for display purposes)
    const loadNickname = async () => {
      const res = await fetch(`/api/group-b?uuid=${uuid}`);
      if (!res.ok) return;
      const strangers = await res.json();
      const res2 = await fetch(`/api/group-c/${chatId}?myUuid=${uuid}`);
      if (!res2.ok) return;
      const chatInfo = await res2.json();
      const match = strangers.find((s: { strangerUuid: string; nickname: string }) =>
        s.strangerUuid === chatInfo.strangerUuid
      );
      if (match) setStrangerNickname(match.nickname);
    };
    loadNickname();
  }, [chatId, fetchChatData, router]);

  if (!myUuid || !chatData) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="h-2 w-2 rounded-full bg-[#C49A3C] animate-pulse" />
      </main>
    );
  }

  return (
    <main className="flex h-screen flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1A1228] px-4 py-4 shrink-0">
        <Link href="/group-c" className="text-xs text-[#6B5D4F] hover:text-[#9B8B6E] transition">
          back
        </Link>
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-sm font-semibold text-[#F5ECD7]">
            {chatData.bothRevealed && chatData.strangerName
              ? chatData.strangerName
              : strangerNickname}
          </span>
          {!chatData.bothRevealed && (
            <span className="text-[10px] text-[#4A3F35]">anonymous</span>
          )}
        </div>
        <span className="w-10" />
      </div>

      {/* Chat messages (takes remaining height) */}
      <ChatWindow
        chatId={chatId}
        myUuid={myUuid}
        strangerUuid={chatData.strangerUuid}
        strangerNickname={strangerNickname}
      />

      {/* Reveal panel pinned at bottom */}
      <RevealPanel
        chatId={chatId}
        myUuid={myUuid}
        myRevealed={chatData.myRevealed}
        theyRevealed={chatData.theyRevealed}
        bothRevealed={chatData.bothRevealed}
        strangerName={chatData.strangerName}
        encounterCount={chatData.encounterCount}
        onReveal={() => fetchChatData(myUuid)}
      />
    </main>
  );
}
