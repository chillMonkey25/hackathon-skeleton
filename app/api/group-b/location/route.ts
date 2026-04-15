// Group B owns this file — location update + proximity-based encounter logging
//
// POST /api/group-b/location
// Body: { uuid, latitude, longitude }
//
// 1. Updates the user's last known location in the DB.
// 2. Finds all other users who have sent a location update in the last 10 minutes
//    and are within NEARBY_METERS of this user.
// 3. For each nearby user, upserts an Encounter record for today (deduped by day)
//    and refreshes the FamiliarStranger row with updated count + status.
// 4. Returns { nearbyCount, newEncounters } so the client can update the UI.

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { generateNickname } from "../encounter/route";

const NEARBY_METERS = 100;          // within 100 m = "nearby"
const ACTIVE_WINDOW_MS = 10 * 60 * 1000; // only consider users active in last 10 min

function haversineMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6_371_000;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getStatus(count: number): string {
  if (count >= 30) return "Almost Known";
  if (count >= 15) return "Silhouette";
  return "Shadow";
}

async function logEncounter(observerUuid: string, observedUuid: string): Promise<boolean> {
  const today = new Date().toISOString().slice(0, 10);

  // One encounter per pair per day — skip if already logged
  const existing = await prisma.encounter.findUnique({
    where: { observerUuid_observedUuid_date: { observerUuid, observedUuid, date: today } },
  });
  if (existing) return false;

  await prisma.encounter.create({ data: { observerUuid, observedUuid, date: today } });

  const encounterCount = await prisma.encounter.count({ where: { observerUuid, observedUuid } });
  const chatUnlocked = encounterCount >= 5;
  const status = getStatus(encounterCount);
  const nickname = generateNickname(observedUuid);

  await prisma.familiarStranger.upsert({
    where: { userUuid_strangerUuid: { userUuid: observerUuid, strangerUuid: observedUuid } },
    update: { encounterCount, status, chatUnlocked, nickname },
    create: { userUuid: observerUuid, strangerUuid: observedUuid, encounterCount, status, chatUnlocked, nickname },
  });

  return true;
}

export async function POST(request: Request) {
  const { uuid, latitude, longitude } = await request.json();
  if (!uuid || latitude == null || longitude == null) {
    return NextResponse.json({ error: "uuid, latitude, longitude required" }, { status: 400 });
  }

  const now = new Date();

  // Update this user's location
  await prisma.user.update({
    where: { uuid },
    data: { latitude, longitude, locationUpdatedAt: now },
  });

  // Find all other users who are recently active and have a location
  const cutoff = new Date(now.getTime() - ACTIVE_WINDOW_MS);
  const activeUsers = await prisma.user.findMany({
    where: {
      uuid: { not: uuid },
      latitude: { not: null },
      longitude: { not: null },
      locationUpdatedAt: { gte: cutoff },
    },
    select: { uuid: true, latitude: true, longitude: true },
  });

  // Filter to users within NEARBY_METERS
  const nearbyUsers = activeUsers.filter(
    (u) => haversineMeters(latitude, longitude, u.latitude!, u.longitude!) <= NEARBY_METERS
  );

  // Log encounters in both directions for each nearby pair
  let newEncounters = 0;
  for (const nearby of nearbyUsers) {
    const a = await logEncounter(uuid, nearby.uuid);
    const b = await logEncounter(nearby.uuid, uuid);
    if (a || b) newEncounters++;
  }

  return NextResponse.json({
    nearbyCount: nearbyUsers.length,
    newEncounters,
  });
}
