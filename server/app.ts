// Express setup
import express from "express";
import cors from "cors";

import mainRouter from "./routes/mainRouter.js";
import config from "./config.js"

const app = express()

app.use(cors());
app.use(express.json());

// Router triggering
app.use("/", mainRouter);

// Launch and port confirmation
app.listen(config.port, () =>
  console.log(`Listeining on port ${config.port}`)
);
