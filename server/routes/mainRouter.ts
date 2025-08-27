// Express set-up
import { Router, Request, Response } from 'express'
const mainRouter = Router();

// Import database queries
import * as db from '../db/queries.js'

// Interfaces

interface UpdateRankingRequest {
  id: number;
  name: string;
}

interface RankingResponse {
  ranking: any; // Replace 'any' with your actual ranking type
}

interface ErrorResponse {
  error: string;
}

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
mainRouter.post('/api/v1/ranking/', async (req: Request<{}, RankingResponse | ErrorResponse, UpdateRankingRequest>, res: Response<RankingResponse | ErrorResponse>) => {
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

export default mainRouter