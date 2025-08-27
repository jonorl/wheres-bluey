import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function retrieveCharacters() {
  const result = await prisma.characters.findMany();
  return result;
}

async function retrieveEntries(scene:string) {
  const result = await prisma.ranking.findMany({
    where: {
      scenario: scene || undefined,
      dateEnd: {
        not: null,
      },
    },
    orderBy: {
      time: "asc",
    },
    take: 10,
  });
  return result;
}

async function startGame(scenario:string) {
  const result = await prisma.ranking.create({
    data: {
      name: "",
      time: 0,
      date: new Date(),
      scenario: scenario
    },
  });
  return { id: result.id, date: result.date };
}

async function updateEntry(id:string, name:string) {
  const dateEnd: Date = new Date();
  const existingEntry = await prisma.ranking.findUnique({
    where: { id },
  });
  if (!existingEntry) {
    throw new Error("Ranking entry not found");
  }
  const existingDate = new Date(existingEntry.date);
  const time = Math.floor((dateEnd.getTime() - existingDate.getTime()) / 1000);  const result = await prisma.ranking.update({
    where: { id },
    data: {
      name,
      time,
      dateEnd,
    },
  });
  return result;
}

export {
  retrieveCharacters,
  retrieveEntries,
  startGame,
  updateEntry,
};
