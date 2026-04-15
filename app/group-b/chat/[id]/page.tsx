"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { STRANGERS, type Stranger } from "@/components/group-b/data"

function NotFound() {
  return (
    <main className="min-h-screen bg-[#0B0910] flex items-center justify-center">
      <p className="text-[#6B5D4F] text-sm">stranger not found</p>
    </main>
  )
}

function MessageBubble({ text, from, color }: { text: string; from: "me" | "them"; color: string }) {
  const isMe = from === "me"
  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className="max-w-[72%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed"
        style={
          isMe
            ? { backgroundColor: "#1E1730", color: "#F5ECD7" }
            : { backgroundColor: `${color}18`, color: "#D4C9B8", border: `1px solid ${color}22` }
        }
      >
        {text}
      </div>
    </div>
  )
}

function RevealCard({ stranger, visible }: { stranger: Stranger; visible: boolean }) {
  return (
    <div
      className="mx-4 rounded-2xl border px-5 py-4 transition-all duration-[1800ms]"
      style={{
        borderColor: `${stranger.color}33`,
        backgroundColor: `${stranger.color}0A`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(8px)",
      }}
    >
      <p className="text-[9px] tracking-[0.28em] uppercase mb-2" style={{ color: stranger.color }}>
        revealed
      </p>
      <p className="text-[#F5ECD7] text-base font-light tracking-wide">{stranger.realName}</p>
      <p className="mt-3 text-[12px] text-[#9B8B6E] leading-relaxed italic">
        "{stranger.icebreaker}"
      </p>
    </div>
  )
}

export default function ChatPage() {
  const params = useParams()
  const id = params?.id as string | undefined
  const stranger: Stranger | undefined = STRANGERS.find((s) => s.id === id)

  const [revealed, setRevealed] = useState(false)
  const [revealVisible, setRevealVisible] = useState(false)
  const [inputText, setInputText] = useState("")
  const [messages, setMessages] = useState(stranger?.messages ?? [])
  const bottomRef = useRef<HTMLDivElement>(null)

  // Restore reveal state from localStorage
  useEffect(() => {
    if (!id) return
    const wasRevealed = localStorage.getItem(`drift_revealed_${id}`) === "1"
    if (wasRevealed) {
      setRevealed(true)
      setRevealVisible(true)
    }
  }, [id])

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, revealed])

  function handleReveal() {
    if (revealed) return
    setRevealed(true)
    localStorage.setItem(`drift_revealed_${id}`, "1")
    // Small delay so the reveal card renders before transitioning in
    requestAnimationFrame(() => {
      setTimeout(() => setRevealVisible(true), 50)
    })
  }

  function handleSend(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const text = inputText.trim()
    if (!text) return
    setMessages((prev) => [
      ...prev,
      { id: `u${Date.now()}`, from: "me", text, ts: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
    ])
    setInputText("")
  }

  if (!stranger) return <NotFound />

  return (
    <main className="min-h-screen bg-[#0B0910] flex flex-col">
      <style>{`
        @keyframes header-in {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .header-in { animation: header-in 0.5s ease both; }

        @keyframes msg-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .msg-in { animation: msg-in 0.35s ease both; }

        .chat-input::placeholder { color: #3A2F4D; }
        .chat-input:focus { outline: none; }
      `}</style>

      {/* ── Header ── */}
      <header
        className="flex items-center justify-between px-5 pt-6 pb-4 border-b border-[#1A1228] header-in"
        style={{ flexShrink: 0 }}
      >
        <div className="flex items-center gap-3">
          <Link
            href="/group-b/orbit"
            className="text-[#6B5D4F] hover:text-[#F5ECD7] transition-colors text-sm"
          >
            ←
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: stranger.color, boxShadow: `0 0 6px ${stranger.color}` }}
              />
              <span className="text-[#F5ECD7] text-sm">{stranger.nickname}</span>
            </div>
            <p className="text-[10px] text-[#6B5D4F] mt-0.5">
              you&apos;ve crossed paths{" "}
              <span style={{ color: stranger.color }}>{stranger.encounters}×</span>
            </p>
          </div>
        </div>

        {/* Reveal button */}
        {!revealed ? (
          <button
            onClick={handleReveal}
            className="text-[9px] tracking-[0.2em] uppercase px-3 py-1.5 rounded-full border transition-all duration-200 hover:border-opacity-70"
            style={{ color: stranger.color, borderColor: `${stranger.color}44` }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.borderColor = `${stranger.color}99`)
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.borderColor = `${stranger.color}44`)
            }
          >
            reveal
          </button>
        ) : (
          <span
            className="text-[9px] tracking-[0.2em] uppercase"
            style={{ color: stranger.color, opacity: 0.5 }}
          >
            revealed
          </span>
        )}
      </header>

      {/* ── Encounter context line ── */}
      <div className="flex justify-center pt-5 pb-2 px-4">
        <span className="text-[10px] tracking-widest uppercase text-[#3A2F4D]">
          {stranger.encounters} shared moments · still strangers
        </span>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2.5">
        {messages.map((msg, i) => (
          <div key={msg.id} className="msg-in" style={{ animationDelay: `${i * 0.04}s` }}>
            <MessageBubble text={msg.text} from={msg.from} color={stranger.color} />
          </div>
        ))}

        {/* Reveal card — appears after messages */}
        {revealed && (
          <div className="pt-2 pb-1">
            <RevealCard stranger={stranger} visible={revealVisible} />
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Input bar ── */}
      <form
        onSubmit={handleSend}
        className="flex items-center gap-3 px-4 py-4 border-t border-[#1A1228]"
        style={{ flexShrink: 0 }}
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="say something…"
          className="chat-input flex-1 bg-[#130E1E] rounded-full px-4 py-2.5 text-sm text-[#F5ECD7] border border-[#2A1F3D] transition-colors duration-150 focus:border-[#8B5CF644]"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-150 disabled:opacity-20"
          style={{ backgroundColor: stranger.color }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M13 1L1 7l5 2 2 4 5-12z" fill="#0B0910" />
          </svg>
        </button>
      </form>
    </main>
  )
}
