import Link from "next/link";

const DOTS = [
  { top: "12%",  left: "8%",   size: 5,  color: "#C49A3C", dur: "6s",  delay: "0s"    },
  { top: "22%",  left: "82%",  size: 3,  color: "#8B5CF6", dur: "8s",  delay: "1.2s"  },
  { top: "38%",  left: "6%",   size: 4,  color: "#8B5CF6", dur: "7s",  delay: "2.4s"  },
  { top: "55%",  left: "91%",  size: 6,  color: "#C49A3C", dur: "9s",  delay: "0.6s"  },
  { top: "70%",  left: "15%",  size: 3,  color: "#C49A3C", dur: "5s",  delay: "3s"    },
  { top: "80%",  left: "75%",  size: 5,  color: "#8B5CF6", dur: "10s", delay: "1.8s"  },
  { top: "18%",  left: "55%",  size: 2,  color: "#C49A3C", dur: "7s",  delay: "4s"    },
  { top: "62%",  left: "48%",  size: 3,  color: "#8B5CF6", dur: "8s",  delay: "2s"    },
  { top: "88%",  left: "38%",  size: 4,  color: "#C49A3C", dur: "6s",  delay: "0.4s"  },
  { top: "45%",  left: "70%",  size: 2,  color: "#8B5CF6", dur: "9s",  delay: "3.6s"  },
];

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6">

      {/* Ambient background dots */}
      <style>{`
        @keyframes drift-pulse {
          0%, 100% { opacity: 0.08; transform: scale(1); }
          50%       { opacity: 0.35; transform: scale(1.4); }
        }
        @keyframes drift-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes drift-fadein {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .dot-pulse {
          animation: drift-pulse var(--dur) ease-in-out var(--delay) infinite;
        }
        .hero-1 { animation: drift-fadein 1s ease 0.1s both; }
        .hero-2 { animation: drift-fadein 1s ease 0.4s both; }
        .hero-3 { animation: drift-fadein 1s ease 0.7s both; }
        .hero-4 { animation: drift-fadein 1s ease 1s both; }
      `}</style>

      {DOTS.map((d, i) => (
        <span
          key={i}
          className="dot-pulse pointer-events-none absolute rounded-full"
          style={{
            top: d.top,
            left: d.left,
            width: d.size * 2,
            height: d.size * 2,
            backgroundColor: d.color,
            "--dur": d.dur,
            "--delay": d.delay,
            boxShadow: `0 0 ${d.size * 3}px ${d.color}`,
          } as React.CSSProperties}
        />
      ))}

      {/* Center ring decoration */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          className="rounded-full border border-[#C49A3C]/8"
          style={{ width: 340, height: 340 }}
        />
        <div
          className="absolute rounded-full border border-[#8B5CF6]/6"
          style={{ width: 520, height: 520 }}
        />
      </div>

      {/* Hero content */}
      <div className="relative flex flex-col items-center gap-8 text-center max-w-xs">

        {/* Wordmark */}
        <div className="hero-1 flex flex-col items-center gap-4">
          <div className="h-1.5 w-1.5 rounded-full bg-[#C49A3C] shadow-[0_0_10px_#C49A3C]" />
          <h1 className="text-6xl font-extralight tracking-[0.3em] text-[#F5ECD7]">
            drift
          </h1>
        </div>

        {/* Tagline */}
        <p className="hero-2 text-sm leading-loose tracking-wide text-[#9B8B6E]">
          the people you keep almost meeting.<br />
          drift notices.
        </p>

        {/* CTA */}
        <div className="hero-3 flex flex-col items-center gap-3">
          <Link
            href="/group-a"
            className="rounded-2xl bg-[#F5ECD7] px-8 py-3 text-sm font-semibold tracking-widest text-[#0B0910] transition-all hover:bg-[#C49A3C] hover:shadow-[0_0_20px_rgba(196,154,60,0.3)]"
          >
            start drifting
          </Link>
          <p className="text-[11px] tracking-wide text-[#3D3047]">
            anonymous by default
          </p>
        </div>

        {/* Feature hints */}
        <div className="hero-4 flex items-center gap-6 text-[10px] tracking-widest text-[#4A3F35] uppercase">
          <span className="flex items-center gap-1.5">
            <span className="h-1 w-1 rounded-full bg-[#C49A3C]" />
            orbit
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1 w-1 rounded-full bg-[#8B5CF6]" />
            familiar strangers
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1 w-1 rounded-full bg-[#C49A3C]" />
            reveal
          </span>
        </div>
      </div>
    </main>
  );
}
