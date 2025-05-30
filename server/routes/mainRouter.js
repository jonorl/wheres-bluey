// Express set-up
const { Router } = require('express');
const mainRouter = Router();

// Import database queries
const db = require('../db/queries');

// GET ROUTES

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

// POST ROUTES

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

// PUT ROUTES

// DELETE ROUTES

module.exports = mainRouter;