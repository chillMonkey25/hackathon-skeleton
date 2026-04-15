// Group A owns this file — User identity CRUD
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

// GET /api/group-a?uuid=xxx
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const uuid = searchParams.get("uuid");
  if (!uuid) return NextResponse.json({ error: "uuid required" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { uuid } });
  if (!user) return NextResponse.json({ error: "not found" }, { status: 404 });

  return NextResponse.json(user);
}

// POST /api/group-a — create user
// Body: { displayName: string }
// Returns: { id, uuid, displayName, bleEnabled, createdAt }
export async function POST(request: Request) {
  const { displayName } = await request.json();
  if (!displayName?.trim()) {
    return NextResponse.json({ error: "displayName required" }, { status: 400 });
  }

  const uuid = crypto.randomUUID();
  const user = await prisma.user.create({
    data: { uuid, displayName: displayName.trim() },
  });

  return NextResponse.json(user, { status: 201 });
}

// PUT /api/group-a — update settings
// Body: { uuid: string, bleEnabled: boolean }
export async function PUT(request: Request) {
  const { uuid, bleEnabled } = await request.json();
  if (!uuid) return NextResponse.json({ error: "uuid required" }, { status: 400 });

  const user = await prisma.user.update({
    where: { uuid },
    data: { bleEnabled },
  });

  return NextResponse.json(user);
}

// DELETE /api/group-a?uuid=xxx — delete user
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const uuid = searchParams.get("uuid");
  if (!uuid) return NextResponse.json({ error: "uuid required" }, { status: 400 });

  await prisma.user.deleteMany({ where: { uuid } });
  return NextResponse.json({ ok: true });
}
