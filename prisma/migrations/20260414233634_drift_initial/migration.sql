-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "bleEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Encounter" (
    "id" TEXT NOT NULL,
    "observerUuid" TEXT NOT NULL,
    "observedUuid" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Encounter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FamiliarStranger" (
    "id" TEXT NOT NULL,
    "userUuid" TEXT NOT NULL,
    "strangerUuid" TEXT NOT NULL,
    "encounterCount" INTEGER NOT NULL DEFAULT 0,
    "nickname" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "chatUnlocked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FamiliarStranger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chat" (
    "id" TEXT NOT NULL,
    "participantAUuid" TEXT NOT NULL,
    "participantBUuid" TEXT NOT NULL,
    "revealedByA" BOOLEAN NOT NULL DEFAULT false,
    "revealedByB" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "senderUuid" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_uuid_key" ON "User"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Encounter_observerUuid_observedUuid_date_key" ON "Encounter"("observerUuid", "observedUuid", "date");

-- CreateIndex
CREATE UNIQUE INDEX "FamiliarStranger_userUuid_strangerUuid_key" ON "FamiliarStranger"("userUuid", "strangerUuid");

-- CreateIndex
CREATE UNIQUE INDEX "Chat_participantAUuid_participantBUuid_key" ON "Chat"("participantAUuid", "participantBUuid");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
