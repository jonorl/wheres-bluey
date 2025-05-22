const { PrismaClient } = require("../generated/prisma/client");
const prisma = new PrismaClient();

async function insertNewEntry(name, time, scenario) {
  const result = await prisma.ranking.create({
    data: {
      name: name,
      time: time,
      scenario: scenario,
    },
  });
  return result;
}

async function retrieveEntries(scenario) {
  const result = await prisma.ranking.findMany({
    where: {
      scenario: scenario,
    },
    orderBy: {
      time: 'asc', 
    },
    take: 10, 
  });
  return result;
}

async function retrieveCharacters() {
  const result = await prisma.characters.findMany({
  });
  return result;
}

module.exports = {
  insertNewEntry,
  retrieveEntries,
  retrieveCharacters,
};
