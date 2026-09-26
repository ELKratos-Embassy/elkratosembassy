import { PrismaClient } from "@prisma/client";
import { ALLIANCE_IDS, SESSION_CODE, SESSION_LABEL } from "../lib/fruit-games-config";
import { FRUIT_GAME_BANK } from "../lib/fruit-games-bank";

const databaseUrl = process.env.DATABASE_URL ?? "";
if (!databaseUrl.includes("@localhost:5437/")) {
  console.error("This reseed only runs against the local embassy database.");
  process.exit(1);
}

const prisma = new PrismaClient();

async function main() {
  const session = await prisma.fruitGameSession.upsert({
    where: { code: SESSION_CODE },
    update: { label: SESSION_LABEL },
    create: { code: SESSION_CODE, label: SESSION_LABEL, isActive: true },
  });

  await prisma.fruitGameScore.createMany({
    data: ALLIANCE_IDS.map((alliance) => ({ sessionId: session.id, alliance, points: 0 })),
    skipDuplicates: true,
  });

  await prisma.fruitGameQuestion.deleteMany({ where: { sessionId: session.id } });
  await prisma.fruitGameQuestion.createMany({
    data: FRUIT_GAME_BANK.map((question) => ({
      sessionId: session.id,
      order: question.order,
      text: question.text,
      section: question.section,
      mode: question.mode,
      points: question.points,
      timerSeconds: question.timerSeconds,
      doublePoints: question.doublePoints,
      options: question.options,
      answerIndex: question.answerIndex,
    })),
  });

  const count = await prisma.fruitGameQuestion.count({ where: { sessionId: session.id } });
  const withChoices = await prisma.fruitGameQuestion.count({
    where: { sessionId: session.id, answerIndex: { not: null } },
  });
  console.log(`Session ${SESSION_CODE}: ${count} questions, ${withChoices} with a checked answer.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
