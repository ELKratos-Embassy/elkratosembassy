import { prisma } from "../lib/prisma";

const BATCH = "BFC-26A";

const ROSTER: Record<string, string> = {
  "ELKE-2018-4HKY": "Kuranga Elizabeth Adetobi",
  "ELKE-2018-F6VQ": "Atanda Oluwasegun Ezekiel",
  "ELKE-2018-11AS": "Folorunsho Emmanuel Ayomide",
  "ELKE-2018-C7BR": "Kuraga Esther Adepelumi",
  "ELKE-2024-39BZ": "Bamidele Alice Ifedolapo",
  "ELKE-2026-2W9S": "Oluwadamilare Ayomide Augustine",
  "ELKE-2026-0399": "Majolagbe Perfection Ayomipo",
  "ELKE-2026-G9YP": "Popoola John Kenny",
  "ELKE-2026-NHJY": "Popoola Matthew Taiwo",
};

async function main() {
  let count = 0;
  for (const [membershipId, name] of Object.entries(ROSTER)) {
    await prisma.quizParticipant.upsert({
      where: { membershipId_batch: { membershipId, batch: BATCH } },
      update: { name },
      create: { membershipId, name, batch: BATCH },
    });
    count += 1;
  }
  console.log(`Seeded ${count} participants for batch ${BATCH}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
