// Group B owns this file — encounter logging + familiar stranger engine
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

const ADJECTIVES = [
  "Velvet","Indigo","Amber","Silver","Crimson","Cobalt","Ivory","Onyx",
  "Misty","Golden","Faded","Quiet","Wandering","Hollow","Gentle","Still",
];
const NOUNS = [
  "Ghost","Fox","Crow","Moth","Heron","Wolf","Raven","Lynx",
  "Echo","Dusk","Spark","Drift","Shade","Glow","Mist","Tide",
];
const EMOJIS = ["👻","🦊","🐦","🌙","🦅","🐺","🌊","🕊","✨","🌫","🔮","🌿","🦋","🌑","🪷","🌒"];

export function generateNickname(uuid: string): string {
  let h = 0;
  for (let i = 0; i < uuid.length; i++) h = (Math.imul(31, h) + uuid.charCodeAt(i)) | 0;
  const u = h >>> 0;
  return `${ADJECTIVES[u % ADJECTIVES.length]} ${NOUNS[(u >> 4) % NOUNS.length]} ${EMOJIS[(u >> 8) % EMOJIS.length]}`;
}

function getStatus(count: number): string {
  if (count >= 30) return "Almost Known";
  if (count >= 15) return "Silhouette";
  return "Shadow";
}

// POST /api/group-b/encounter
// Body: { observerUuid: string, observedUuid: string }
// Logs one encounter for today (deduped). Updates or creates FamiliarStranger.
export async function POST(request: Request) {
  const { observerUuid, observedUuid } = await request.json();
  if (!observerUuid || !observedUuid) {
    return NextResponse.json({ error: "observerUuid and observedUuid required" }, { status: 400 });
  }

  const today = new Date().toISOString().slice(0, 10);

  // Upsert the encounter row for today (one per day max)
  await prisma.encounter.upsert({
    where: { observerUuid_observedUuid_date: { observerUuid, observedUuid, date: today } },
    update: {},
    create: { observerUuid, observedUuid, date: today },
  });

  // Count distinct encounter days
  const encounterCount = await prisma.encounter.count({
    where: { observerUuid, observedUuid },
  });

  const chatUnlocked = encounterCount >= 5;
  const status = getStatus(encounterCount);
  const nickname = generateNickname(observedUuid);

  // Upsert FamiliarStranger record
  const stranger = await prisma.familiarStranger.upsert({
    where: { userUuid_strangerUuid: { userUuid: observerUuid, strangerUuid: observedUuid } },
    update: { encounterCount, status, chatUnlocked, nickname },
    create: { userUuid: observerUuid, strangerUuid: observedUuid, encounterCount, status, chatUnlocked, nickname },
  });

  return NextResponse.json(stranger, { status: 201 });
}
