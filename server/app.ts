// Config
import { config } from 'dotenv'

// Express setup
import express from "express";
import cors from "cors";

import mainRouter from "./routes/mainRouter.js";

const app = express()

app.use(cors());
app.use(express.json());

// Router triggering
app.use("/", mainRouter);

// Launch and port confirmation
app.listen(process.env.PORT, () =>
  console.log(`Listeining on port ${process.env.PORT}`)
);
