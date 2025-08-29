import { Router, Request, Response } from "express";
import * as db from "../db/queries.js";

const mainRouter = Router();

// Interfaces

interface UpdateRankingRequest {
  id: string;
  name: string;
}

interface StartData {
  id: string;
  date: Date;
}

interface Ranking {
  id: string;
  name: string;
  time: number;
  date: Date;
  scenario: string | null; // leaving null as scenario can be optional on prisma schema
  dateEnd: Date | null; // leaving null as dateEnd can be optional on prisma schema
}

interface ErrorResponse {
  error: string;
}

interface Coordinates {
  id: string;
  name: string;
  xrange: Array<number>;
  yrange: Array<number>;
}
[];

interface CharactersResponse {
  coordinates: Coordinates[];
}

interface RankingResponse {
  ranking: Ranking;
}

interface UpdateRankingResponse {
  ranking: Ranking[]
}

// GET ROUTES

// Get all character coordinates
mainRouter.get(
  "/api/v1/characters/",
  async (req, res: Response<CharactersResponse | ErrorResponse>) => {
    try {
      const coordinates: Coordinates[] = await db.retrieveCharacters();
      res.json({ coordinates });
    } catch (error) {
      console.error("Error fetching characters:", error);
      res.status(500).json({ error: "Failed to retrieve characters" });
    }
  }
);

// Get the full ranking table for the scenario
mainRouter.get(
  "/api/v1/ranking/:scene",
  async (
    req: Request<{ scene: string }>,
    res: Response<UpdateRankingResponse | ErrorResponse>
  ) => {
    try {
      const ranking: Ranking[] = await db.retrieveEntries(req.params.scene);
      res.json({ ranking });
    } catch (error) {
      console.error("Error retrieving rankings:", error);
      res.status(500).json({ error: "Failed to retrieve rankings" });
    }
  }
);

// POST ROUTES

// Start a new game
mainRouter.post(
  "/api/v1/ranking/start/:scene",
  async (
    req: Request<{ scene: string }>,
    res: Response<StartData | ErrorResponse>
  ) => {
    try {
      const startData: StartData = await db.startGame(req.params.scene);
      res.json(startData);
    } catch (error) {
      console.error("Error starting game:", error);
      res.status(500).json({ error: "Failed to start game" });
    }
  }
);

// Update ranking entry with name and end time
mainRouter.post(
  "/api/v1/ranking/",
  async (
    req: Request<{}, any, UpdateRankingRequest>,
    res: Response<RankingResponse | ErrorResponse>
  ) => {
    const { id, name } = req.body;

    if (!id || typeof id !== "string") {
      return res
        .status(400)
        .json({ error: "ID is required and must be a string" });
    }

    if (!name || typeof name !== "string" || name.trim() === "") {
      return res
        .status(400)
        .json({ error: "Name is required and must be a non-empty string" });
    }

    try {
      const ranking: Ranking = await db.updateEntry(id, name);
      res.json({ ranking });
    } catch (error) {
      console.error("Error updating ranking:", error);
      res.status(500).json({ error: "Failed to update ranking" });
    }
  }
);

// PUT ROUTES

// DELETE ROUTES

export default mainRouter;