"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function OnboardingPage() {
  const [name, setName] = useState("")
  const [going, setGoing] = useState(false)
  const router = useRouter()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!name.trim()) return
    localStorage.setItem("drift_display_name", name.trim())
    setGoing(true)
    router.push("/group-b/orbit")
  }

  return (
    <main className="min-h-screen bg-[#0B0910] flex flex-col items-center justify-center px-8">
      <style>{`
        @keyframes ob-up {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ob-1 { animation: ob-up 0.8s ease both; }
        .ob-2 { animation: ob-up 0.8s ease 0.25s both; }
        .ob-3 { animation: ob-up 0.8s ease 0.5s both; }

        .drift-input::placeholder { color: #3A2F4D; }
        .drift-input:focus { outline: none; border-bottom-color: #8B5CF6; }
      `}</style>

      <div className="w-full max-w-xs space-y-12">

        {/* Logo */}
        <div className="text-center ob-1">
          <h1 className="text-4xl font-extralight tracking-[0.35em] text-[#F5ECD7]">drift</h1>
          <p className="mt-3 text-[11px] tracking-[0.22em] text-[#6B5D4F] uppercase">
            the people you keep almost meeting
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8 ob-2">
          <div>
            <label className="block text-[10px] tracking-[0.25em] uppercase text-[#6B5D4F] mb-4">
              what should we call you?
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="your name"
              autoFocus
              className="drift-input w-full bg-transparent border-b border-[#2A1F3D] text-[#F5ECD7] text-lg py-2 transition-colors duration-200"
            />
          </div>

          <button
            type="submit"
            disabled={!name.trim() || going}
            className="w-full py-3 text-[11px] tracking-[0.25em] uppercase transition-all duration-200 disabled:opacity-25 disabled:cursor-not-allowed"
            style={{
              backgroundColor: going ? "#C49A3C" : "#F5ECD7",
              color: "#0B0910",
            }}
            onMouseEnter={(e) => {
              if (!going && name.trim())
                (e.currentTarget as HTMLElement).style.backgroundColor = "#C49A3C"
            }}
            onMouseLeave={(e) => {
              if (!going)
                (e.currentTarget as HTMLElement).style.backgroundColor = "#F5ECD7"
            }}
          >
            {going ? "stepping in…" : "step into the drift"}
          </button>
        </form>

        {/* Fine print */}
        <p className="text-center text-[10px] text-[#2A1F3D] leading-relaxed ob-3">
          your identity stays anonymous
          <br />
          until you choose to reveal
        </p>
      </div>
    </main>
  )
}
