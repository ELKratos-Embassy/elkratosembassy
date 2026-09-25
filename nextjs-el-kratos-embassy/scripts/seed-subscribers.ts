import { readFileSync } from "node:fs";
import path from "node:path";
import { prisma } from "../lib/prisma";

type SubscriberDoc = {
  email?: string;
  subscribed?: boolean;
};

async function main() {
  const filePath = path.join(process.cwd(), "subscribers.json");
  const raw = readFileSync(filePath, "utf8").trim();
  const parsed = JSON.parse(raw.startsWith("[") ? raw : `[${raw.split("\n").filter(Boolean).join(",")}]`);
  const docs = (Array.isArray(parsed) ? parsed : [parsed]) as SubscriberDoc[];

  let upserted = 0;
  for (const doc of docs) {
    const email = doc.email?.trim().toLowerCase();
    if (!email) continue;
    await prisma.subscriber.upsert({
      where: { email },
      update: {},
      create: { email, subscribed: doc.subscribed ?? true },
    });
    upserted += 1;
  }

  console.log(`Seeded ${upserted} subscriber${upserted === 1 ? "" : "s"}.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
