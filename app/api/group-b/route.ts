// Group B owns this file — familiar strangers list
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

// GET /api/group-b?uuid=xxx
// Returns all FamiliarStranger records for this user, sorted by encounter count desc
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const uuid = searchParams.get("uuid");
  if (!uuid) return NextResponse.json({ error: "uuid required" }, { status: 400 });

  const strangers = await prisma.familiarStranger.findMany({
    where: { userUuid: uuid },
    orderBy: { encounterCount: "desc" },
  });

  return NextResponse.json(strangers);
}
