"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { STRANGERS, type Stranger } from "@/components/group-b/data"

// Place 3 nodes in a triangle around a center point (percentages within container)
function nodePosition(index: number): { x: number; y: number } {
  const angle = (index * 120 - 90) * (Math.PI / 180)
  const r = 37
  return {
    x: 50 + r * Math.cos(angle),
    y: 50 + r * Math.sin(angle),
  }
}

const FLOAT_ANIMATIONS = [
  "float-a 5.2s ease-in-out infinite",
  "float-b 6.8s ease-in-out infinite",
  "float-c 4.6s ease-in-out infinite",
]

function StrangerNode({ stranger, index }: { stranger: Stranger; index: number }) {
  const [hovered, setHovered] = useState(false)
  const { x, y } = nodePosition(index)

  return (
    // Outer div: absolute position only (no transform animation, avoids conflict)
    <div
      className="absolute"
      style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
    >
      {/* Inner: float animation */}
      <Link
        href={`/group-b/chat/${stranger.id}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", animation: FLOAT_ANIMATIONS[index] }}
      >
        {/* Ambient glow behind the dot */}
        <div className="relative flex items-center justify-center">
          <div
            className="absolute rounded-full blur-xl transition-all duration-700"
            style={{
              width: hovered ? "72px" : "48px",
              height: hovered ? "72px" : "48px",
              backgroundColor: stranger.color,
              opacity: hovered ? 0.4 : 0.18,
            }}
          />
          {/* The dot itself */}
          <div
            className="relative rounded-full border transition-all duration-400"
            style={{
              width: hovered ? "48px" : "36px",
              height: hovered ? "48px" : "36px",
              backgroundColor: `${stranger.color}18`,
              borderColor: stranger.color,
              borderWidth: "1px",
              boxShadow: `0 0 ${hovered ? 20 : 10}px ${stranger.color}55`,
            }}
          />
        </div>

        {/* Label below dot */}
        <div
          className="flex flex-col items-center text-center transition-opacity duration-300"
          style={{ opacity: hovered ? 1 : 0.55, width: "96px" }}
        >
          <span className="text-[10px] leading-tight text-[#F5ECD7]" style={{ wordBreak: "break-word" }}>
            {stranger.nickname}
          </span>
          <span
            className="mt-1 text-[9px] tracking-widest uppercase px-2 py-px rounded-full border"
            style={{ color: stranger.color, borderColor: `${stranger.color}44` }}
          >
            {stranger.status}
          </span>
          <span className="mt-0.5 text-[9px] text-[#6B5D4F]">
            {stranger.encounters}×
          </span>
        </div>
      </Link>
    </div>
  )
}

export default function OrbitPage() {
  const [displayName, setDisplayName] = useState<string | null>(null)

  useEffect(() => {
    setDisplayName(localStorage.getItem("drift_display_name"))
  }, [])

  return (
    <main className="min-h-screen bg-[#0B0910] flex flex-col items-center justify-center px-4 py-12">
      <style>{`
        @keyframes float-a {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-7px); }
        }
        @keyframes float-b {
          0%, 100% { transform: translateY(-3px); }
          50%       { transform: translateY(5px); }
        }
        @keyframes float-c {
          0%, 100% { transform: translateY(2px); }
          50%       { transform: translateY(-9px); }
        }
        @keyframes spin-cw {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes spin-ccw {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        @keyframes breathe {
          0%, 100% { opacity: 0.06; transform: scale(1); }
          50%       { opacity: 0.14; transform: scale(1.04); }
        }
        @keyframes page-in {
          from { opacity: 0; transform: scale(0.97); }
          to   { opacity: 1; transform: scale(1); }
        }
        .page-in { animation: page-in 0.7s ease forwards; }
      `}</style>

      <div className="w-full max-w-xs flex flex-col items-center gap-10 page-in">

        {/* Header */}
        <div className="text-center">
          <p className="text-[11px] tracking-[0.28em] uppercase text-[#6B5D4F]">
            {displayName ? `${displayName}'s orbit` : "your orbit"}
          </p>
          <p className="mt-1.5 text-[10px] text-[#3A2F4D]">
            {STRANGERS.length} familiar strangers nearby
          </p>
        </div>

        {/* Orbital canvas */}
        <div className="relative" style={{ width: "288px", height: "288px" }}>

          {/* Deep background nebula */}
          <div
            className="absolute rounded-full"
            style={{
              width: "160px",
              height: "160px",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              background: "radial-gradient(circle, #8B5CF608 0%, transparent 70%)",
              boxShadow: "0 0 60px 30px #8B5CF606",
              animation: "breathe 5s ease-in-out infinite",
            }}
          />

          {/* Outer orbit ring — slow CW */}
          <svg
            className="absolute inset-0 w-full h-full"
            style={{ animation: "spin-cw 150s linear infinite" }}
          >
            <circle
              cx="50%" cy="50%" r="43%"
              stroke="#2A1F3D"
              strokeWidth="0.75"
              fill="none"
              strokeDasharray="2 14"
            />
          </svg>

          {/* Inner orbit ring — slow CCW */}
          <svg
            className="absolute inset-0 w-full h-full"
            style={{ animation: "spin-ccw 100s linear infinite" }}
          >
            <circle
              cx="50%" cy="50%" r="20%"
              stroke="#1A1228"
              strokeWidth="0.75"
              fill="none"
              strokeDasharray="2 8"
            />
          </svg>

          {/* You — center dot */}
          <div
            className="absolute"
            style={{
              width: "8px",
              height: "8px",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              borderRadius: "9999px",
              backgroundColor: "#F5ECD722",
              border: "1px solid #F5ECD733",
              boxShadow: "0 0 8px 4px #F5ECD710",
            }}
          />

          {/* Stranger nodes */}
          {STRANGERS.map((s, i) => (
            <StrangerNode key={s.id} stranger={s} index={i} />
          ))}
        </div>

        {/* Stranger cards legend */}
        <div className="w-full space-y-2">
          {STRANGERS.map((s) => (
            <Link
              key={s.id}
              href={`/group-b/chat/${s.id}`}
              className="flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200 hover:border-opacity-60"
              style={{
                borderColor: `${s.color}22`,
                backgroundColor: `${s.color}08`,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = `${s.color}55`
                ;(e.currentTarget as HTMLElement).style.backgroundColor = `${s.color}12`
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = `${s.color}22`
                ;(e.currentTarget as HTMLElement).style.backgroundColor = `${s.color}08`
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: s.color, boxShadow: `0 0 6px ${s.color}` }}
                />
                <div>
                  <div className="text-[12px] text-[#F5ECD7]">{s.nickname}</div>
                  <div className="text-[10px] text-[#6B5D4F]">{s.encounters} encounters</div>
                </div>
              </div>
              <span
                className="text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-full border"
                style={{ color: s.color, borderColor: `${s.color}44` }}
              >
                {s.status}
              </span>
            </Link>
          ))}
        </div>

        {/* Back link */}
        <Link
          href="/group-b"
          className="text-[10px] tracking-widest uppercase text-[#3A2F4D] hover:text-[#6B5D4F] transition-colors"
        >
          ← change name
        </Link>
      </div>
    </main>
  )
}
