// Group A owns this file — demo seeder (project owner runs once)
//
// POST /api/group-a/seed
// Body: { myUuid: string }
//
// Creates 4 fake familiar strangers at different encounter stages so judges
// can see the full Drift flow without needing real BLE encounters.
//
// NOTE: This endpoint intentionally writes to Group B and C tables (Encounter,
// FamiliarStranger, Chat, Message) because it is a one-time demo setup script
// owned by the project owner. In normal use, each group only touches its own tables.

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

const STRANGERS = [
  {
    uuid: "demo-uuid-velvet-001",
    displayName: "Demo User 1",
    nickname: "Velvet Tuesday Ghost",
    encounterCount: 34,
    status: "Almost Known",
  },
  {
    uuid: "demo-uuid-indigo-002",
    displayName: "Demo User 2",
    nickname: "Indigo Morning Fox",
    encounterCount: 18,
    status: "Silhouette",
  },
  {
    uuid: "demo-uuid-amber-003",
    displayName: "Demo User 3",
    nickname: "Amber Quiet Crow",
    encounterCount: 7,
    status: "Shadow",
  },
  {
    uuid: "demo-uuid-silver-004",
    displayName: "Demo User 4",
    nickname: "Silver Late Moth",
    encounterCount: 5,
    status: "Shadow",
  },
];

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10); // "YYYY-MM-DD"
}

export async function POST(request: Request) {
  const { myUuid } = await request.json();
  if (!myUuid) {
    return NextResponse.json({ error: "myUuid required" }, { status: 400 });
  }

  // Wipe any existing demo data for this user
  await prisma.encounter.deleteMany({ where: { observerUuid: myUuid } });
  await prisma.familiarStranger.deleteMany({ where: { userUuid: myUuid } });
  const existingChats = await prisma.chat.findMany({
    where: {
      OR: [{ participantAUuid: myUuid }, { participantBUuid: myUuid }],
    },
    select: { id: true },
  });
  if (existingChats.length > 0) {
    const chatIds = existingChats.map((c) => c.id);
    await prisma.message.deleteMany({ where: { chatId: { in: chatIds } } });
    await prisma.chat.deleteMany({ where: { id: { in: chatIds } } });
  }

  // Upsert fake stranger User records
  for (const s of STRANGERS) {
    await prisma.user.upsert({
      where: { uuid: s.uuid },
      update: {},
      create: { uuid: s.uuid, displayName: s.displayName },
    });
  }

  // Create Encounter rows (spread across past days)
  const encounterRows = STRANGERS.flatMap((s) =>
    Array.from({ length: Math.min(s.encounterCount, 10) }, (_, i) => ({
      observerUuid: myUuid,
      observedUuid: s.uuid,
      date: daysAgo(i + 1),
    }))
  );
  // skipDuplicates in case seed is run twice
  await prisma.encounter.createMany({ data: encounterRows, skipDuplicates: true });

  // Create FamiliarStranger rows
  await prisma.familiarStranger.createMany({
    data: STRANGERS.map((s) => ({
      userUuid: myUuid,
      strangerUuid: s.uuid,
      encounterCount: s.encounterCount,
      nickname: s.nickname,
      status: s.status,
      chatUnlocked: true,
    })),
    skipDuplicates: true,
  });

  // Create a demo chat with the "Almost Known" stranger (Velvet Tuesday Ghost)
  const almostKnown = STRANGERS[0];
  const chat = await prisma.chat.upsert({
    where: {
      participantAUuid_participantBUuid: {
        participantAUuid: myUuid,
        participantBUuid: almostKnown.uuid,
      },
    },
    update: {},
    create: {
      participantAUuid: myUuid,
      participantBUuid: almostKnown.uuid,
    },
  });

  await prisma.message.createMany({
    data: [
      {
        chatId: chat.id,
        senderUuid: almostKnown.uuid,
        content: "hey. you sit by the window, right?",
      },
      {
        chatId: chat.id,
        senderUuid: myUuid,
        content: "yeah, every morning. didn't know anyone noticed",
      },
      {
        chatId: chat.id,
        senderUuid: almostKnown.uuid,
        content: "34 times apparently",
      },
    ],
    skipDuplicates: true,
  });

  return NextResponse.json({
    ok: true,
    seeded: {
      strangers: STRANGERS.length,
      encounters: encounterRows.length,
      chat: chat.id,
    },
  });
}
