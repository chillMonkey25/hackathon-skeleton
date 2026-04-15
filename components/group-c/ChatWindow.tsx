"use client";

import { useEffect, useRef, useState } from "react";

type Message = {
  id: string;
  senderUuid: string;
  content: string;
  createdAt: string;
};

type Props = {
  chatId: string;
  myUuid: string;
  strangerUuid: string;
  strangerNickname: string;
};

export default function ChatWindow({ chatId, myUuid, strangerUuid, strangerNickname }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  async function fetchMessages() {
    const res = await fetch(`/api/group-c/${chatId}?myUuid=${myUuid}`);
    if (!res.ok) return;
    const data = await res.json();
    setMessages(data.messages ?? []);
  }

  // Poll every 2 seconds for new messages
  useEffect(() => {
    fetchMessages();
    const id = setInterval(fetchMessages, 2000);
    return () => clearInterval(id);
  }, [chatId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || sending) return;
    setSending(true);
    await fetch(`/api/group-c/${chatId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senderUuid: myUuid, content: input.trim() }),
    });
    setInput("");
    setSending(false);
    await fetchMessages();
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {messages.length === 0 && (
          <p className="text-center text-xs text-[#4A3F35] mt-8">
            no messages yet. say something.
          </p>
        )}
        {messages.map((m) => {
          const isMe = m.senderUuid === myUuid;
          return (
            <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  isMe
                    ? "bg-[#C49A3C]/20 text-[#F5ECD7] rounded-br-sm"
                    : "bg-[#2A1F3D] text-[#F5ECD7] rounded-bl-sm"
                }`}
              >
                {m.content}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="flex gap-2 border-t border-[#1A1228] px-4 py-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="say something..."
          className="flex-1 rounded-xl bg-[#130E1E] border border-[#2A1F3D] px-4 py-2.5 text-sm text-[#F5ECD7] placeholder-[#3A2F4D] outline-none focus:border-[#C49A3C]"
        />
        <button
          type="submit"
          disabled={!input.trim() || sending}
          className="rounded-xl bg-[#C49A3C] px-4 py-2.5 text-sm font-semibold text-[#0B0910] transition hover:bg-[#D4AA4C] disabled:opacity-40"
        >
          {sending ? "..." : "send"}
        </button>
      </form>
    </div>
  );
}
