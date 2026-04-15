// Group C owns this file — chat list + find-or-create chat
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

// GET /api/group-c?myUuid=xxx
// Returns all chats for this user with the last message
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const myUuid = searchParams.get("myUuid");
  if (!myUuid) return NextResponse.json({ error: "myUuid required" }, { status: 400 });

  const chats = await prisma.chat.findMany({
    where: {
      OR: [{ participantAUuid: myUuid }, { participantBUuid: myUuid }],
    },
    include: {
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
  });

  // Attach stranger UUID for each chat
  const result = chats.map((c) => ({
    ...c,
    strangerUuid: c.participantAUuid === myUuid ? c.participantBUuid : c.participantAUuid,
    lastMessage: c.messages[0] ?? null,
  }));

  return NextResponse.json(result);
}

// POST /api/group-c
// Body: { myUuid, strangerUuid }
// Find or create a chat between the two UUIDs. Returns { chatId }.
export async function POST(request: Request) {
  const { myUuid, strangerUuid } = await request.json();
  if (!myUuid || !strangerUuid) {
    return NextResponse.json({ error: "myUuid and strangerUuid required" }, { status: 400 });
  }

  // Canonical ordering so A < B alphabetically — prevents duplicate chats
  const [a, b] = [myUuid, strangerUuid].sort();

  const chat = await prisma.chat.upsert({
    where: { participantAUuid_participantBUuid: { participantAUuid: a, participantBUuid: b } },
    update: {},
    create: { participantAUuid: a, participantBUuid: b },
  });

  return NextResponse.json({ chatId: chat.id }, { status: 201 });
}
