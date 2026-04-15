"use client";

import { useRouter } from "next/navigation";

type Stranger = {
  id: string;
  strangerUuid: string;
  nickname: string;
  encounterCount: number;
  status: string;
  chatUnlocked: boolean;
};

type Props = { strangers: Stranger[] };

const RING: Record<string, { r: number; color: string; size: number }> = {
  "Almost Known": { r: 72,  color: "#C49A3C", size: 12 },
  "Silhouette":   { r: 120, color: "#8B5CF6", size: 9  },
  "Shadow":       { r: 162, color: "#3D3047", size: 7  },
};

export default function OrbitView({ strangers }: Props) {
  const router = useRouter();
  const cx = 190;
  const cy = 190;

  // Group strangers by status
  const grouped: Record<string, Stranger[]> = { "Almost Known": [], "Silhouette": [], "Shadow": [] };
  for (const s of strangers) {
    const key = s.status in grouped ? s.status : "Shadow";
    grouped[key].push(s);
  }

  function handleDotClick(s: Stranger) {
    if (s.chatUnlocked) router.push(`/group-c?strangerUuid=${s.strangerUuid}`);
  }

  return (
    <div className="relative flex items-center justify-center">
      <svg width={380} height={380} className="overflow-visible">
        {/* Orbit rings */}
        {Object.entries(RING).map(([status, ring]) => (
          <circle
            key={status}
            cx={cx} cy={cy} r={ring.r}
            fill="none"
            stroke={ring.color}
            strokeWidth={0.5}
            strokeDasharray="3 6"
            opacity={0.25}
          />
        ))}

        {/* Center dot — you */}
        <circle cx={cx} cy={cy} r={7} fill="#C49A3C" opacity={0.9} />
        <circle cx={cx} cy={cy} r={14} fill="#C49A3C" opacity={0.12}>
          <animate attributeName="r" values="10;20;10" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.15;0.04;0.15" dur="3s" repeatCount="indefinite" />
        </circle>
        <text x={cx} y={cy + 26} textAnchor="middle" fontSize={9} fill="#9B8B6E">you</text>

        {/* Stranger dots */}
        {Object.entries(grouped).map(([status, group]) =>
          group.map((s, i) => {
            const ring = RING[status];
            const angle = ((2 * Math.PI) / Math.max(group.length, 1)) * i - Math.PI / 2;
            const x = cx + ring.r * Math.cos(angle);
            const y = cy + ring.r * Math.sin(angle);
            const label = s.nickname.split(" ").slice(0, 2).join(" ");
            return (
              <g
                key={s.id}
                onClick={() => handleDotClick(s)}
                className={s.chatUnlocked ? "cursor-pointer" : "cursor-default"}
              >
                {/* Glow */}
                <circle cx={x} cy={y} r={ring.size + 6} fill={ring.color} opacity={0.08}>
                  <animate attributeName="r" values={`${ring.size + 4};${ring.size + 10};${ring.size + 4}`}
                    dur={`${3 + i * 0.7}s`} repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.1;0.03;0.1"
                    dur={`${3 + i * 0.7}s`} repeatCount="indefinite" />
                </circle>
                {/* Dot */}
                <circle cx={x} cy={y} r={ring.size} fill={ring.color} opacity={0.85} />
                {/* Label */}
                <text
                  x={x} y={y + ring.size + 12}
                  textAnchor="middle" fontSize={8}
                  fill="#9B8B6E"
                  className="pointer-events-none select-none"
                >
                  {label}
                </text>
              </g>
            );
          })
        )}
      </svg>
    </div>
  );
}
