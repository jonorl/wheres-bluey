const { PrismaClient } = require("../generated/prisma/client");
const prisma = new PrismaClient();

async function retrieveCharacters() {
  const result = await prisma.characters.findMany();
  return result;
}

async function retrieveEntries(scenario) {
  const result = await prisma.ranking.findMany({
    where: {
      scenario: scenario || undefined,
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

async function startGame() {
  const result = await prisma.ranking.create({
    data: {
      name: "",
      time: 0,
      date: new Date(),
    },
  });
  return { id: result.id, date: result.date };
}

async function updateEntry(id, name) {
  const dateEnd = new Date();
  const existingEntry = await prisma.ranking.findUnique({
    where: { id },
  });
  if (!existingEntry) {
    throw new Error("Ranking entry not found");
  }
  const time = Math.floor((dateEnd - new Date(existingEntry.date)) / 1000);
  const result = await prisma.ranking.update({
    where: { id },
    data: {
      name,
      time,
      dateEnd,
    },
  });
  return result;
}

module.exports = {
  retrieveCharacters,
  retrieveEntries,
  startGame,
  updateEntry,
};
