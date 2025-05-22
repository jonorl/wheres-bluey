const { Router } = require('express');
const mainRouter = Router();
const db = require('../db/queries');

// Get all character coordinates
mainRouter.get('/api/v1/characters/', async (req, res) => {
  try {
    const coordinates = await db.retrieveCharacters();
    res.json({ coordinates });
  } catch (error) {
    console.error('Error fetching characters:', error);
    res.status(500).json({ error: 'Failed to retrieve characters' });
  }
});

// Start a new game
mainRouter.post('/api/v1/ranking/start/:scene', async (req, res) => {
  try {
    console.log("params", req.params)
    const scenario = req.params.scene 
    console.log(scenario)
    const startData = await db.startGame(scenario);
    res.json(startData);
  } catch (error) {
    console.error('Error starting game:', error);
    res.status(500).json({ error: 'Failed to start game' });
  }
});

// Update ranking entry with name and end time
mainRouter.post('/api/v1/ranking/', async (req, res) => {
  const { id, name } = req.body;
  const scene = req.params.scene

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'ID is required and must be a string' });
  }
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'Name is required and must be a non-empty string' });
  }

  try {
    const ranking = await db.updateEntry(id, name);
    res.json({ ranking });
  } catch (error) {
    console.error('Error updating ranking:', error);
    res.status(500).json({ error: 'Failed to update ranking' });
  }
});

// Get the full ranking table for the scenario
mainRouter.get('/api/v1/ranking/:scene', async (req, res) => {
  try {
    const ranking = await db.retrieveEntries(req.params.scene);
    res.json({ ranking });
  } catch (error) {
    console.error('Error retrieving rankings:', error);
    res.status(500).json({ error: 'Failed to retrieve rankings' });
  }
});

module.exports = mainRouter;