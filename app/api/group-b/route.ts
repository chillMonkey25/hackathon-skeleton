// Group B — own this file and everything under app/api/group-b/
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  return NextResponse.json({ message: "Group B GET stub" });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ message: "Group B POST stub", received: body }, { status: 201 });
}
