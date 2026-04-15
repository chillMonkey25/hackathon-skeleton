// Group C owns this file — messages + reveal for a specific chat
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

type Params = { params: Promise<{ chatId: string }> };

// GET /api/group-c/[chatId]?myUuid=xxx
// Returns chat details, all messages, stranger's display name (if revealed), encounter count
export async function GET(request: Request, { params }: Params) {
  const { chatId } = await params;
  const { searchParams } = new URL(request.url);
  const myUuid = searchParams.get("myUuid");
  if (!myUuid) return NextResponse.json({ error: "myUuid required" }, { status: 400 });

  const chat = await prisma.chat.findUnique({
    where: { id: chatId },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });
  if (!chat) return NextResponse.json({ error: "not found" }, { status: 404 });

  const strangerUuid =
    chat.participantAUuid === myUuid ? chat.participantBUuid : chat.participantAUuid;

  const iAmA = chat.participantAUuid === myUuid;
  const myRevealed  = iAmA ? chat.revealedByA : chat.revealedByB;
  const theyRevealed = iAmA ? chat.revealedByB : chat.revealedByA;
  const bothRevealed = chat.revealedByA && chat.revealedByB;

  // Fetch stranger's display name only if both revealed
  let strangerName: string | null = null;
  if (bothRevealed) {
    const stranger = await prisma.user.findUnique({ where: { uuid: strangerUuid } });
    strangerName = stranger?.displayName ?? null;
  }

  // Read encounter count from FamiliarStranger for the icebreaker
  // (read-only cross-group reference — only used after both reveal)
  let encounterCount = 0;
  if (bothRevealed) {
    const fs = await prisma.familiarStranger.findUnique({
      where: { userUuid_strangerUuid: { userUuid: myUuid, strangerUuid } },
    });
    encounterCount = fs?.encounterCount ?? 0;
  }

  return NextResponse.json({
    chat,
    messages: chat.messages,
    strangerUuid,
    strangerName,
    myRevealed,
    theyRevealed,
    bothRevealed,
    encounterCount,
  });
}

// POST /api/group-c/[chatId]
// Body: { senderUuid, content }
// Sends a message
export async function POST(request: Request, { params }: Params) {
  const { chatId } = await params;
  const { senderUuid, content } = await request.json();
  if (!senderUuid || !content?.trim()) {
    return NextResponse.json({ error: "senderUuid and content required" }, { status: 400 });
  }

  const message = await prisma.message.create({
    data: { chatId, senderUuid, content: content.trim() },
  });

  return NextResponse.json(message, { status: 201 });
}

// PUT /api/group-c/[chatId]
// Body: { myUuid }
// Toggles reveal for this user
export async function PUT(request: Request, { params }: Params) {
  const { chatId } = await params;
  const { myUuid } = await request.json();
  if (!myUuid) return NextResponse.json({ error: "myUuid required" }, { status: 400 });

  const chat = await prisma.chat.findUnique({ where: { id: chatId } });
  if (!chat) return NextResponse.json({ error: "not found" }, { status: 404 });

  const iAmA = chat.participantAUuid === myUuid;
  const updated = await prisma.chat.update({
    where: { id: chatId },
    data: iAmA ? { revealedByA: true } : { revealedByB: true },
  });

  return NextResponse.json(updated);
}
