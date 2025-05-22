const { Router } = require("express");
const mainRouter = Router();
const db = require('../db/queries');

// Get the full ranking table for the scenario
mainRouter.get("/api/v1/ranking/:scenario?", async (req, res) => {
  const ranking = await db.retrieveEntries(req.params.scenario);
  res.json({ ranking });
});

// Get the coordinates for the characters
mainRouter.get("/api/v1/characters/", async (req, res) => {
  const coordinates = await db.retrieveCharacters();
  res.json({ coordinates });
});

// Add new entry to ranking table
mainRouter.post("/api/v1/ranking/:scenario?", async (req, res) => {
  const name = req.body.name;
  const time = req.body.time;
  const scenario = req.params.scenario;
  const ranking = await db.insertNewEntry(name, time, scenario);
  res.json({ ranking });
});

module.exports = mainRouter;
