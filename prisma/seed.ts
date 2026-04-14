// Seed script — run with:  npx prisma db seed
import { PrismaClient } from "../node_modules/.prisma/client";

const prisma = new PrismaClient();

async function main() {
  // TODO: insert demo/seed data here so the whole team has the same starting state
  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
