# Where's Bluey (variation of Where's Wally)

This project is a full-stack web app built with React, Node.js, Express, and Prisma as part of The Odin Project curriculum.

## Features

- **Interactive Gameplay**: Click on the image to find Socks, Muffin, and Bob Bilby, with a dropdown menu to select your guess.
- **Timed Challenge**: Track your time from start to finish, with durations accurately recorded on the backend.
- **Leaderboard**: Submit your name and time to see how you rank against other players.
- **Responsive Design**: Play on desktop or mobile with a clean, Bluey-themed UI.
- **Backend-Driven**: Character coordinates and game timing are managed via a robust Express API with a PostgreSQL database.
- **Error Handling**: Graceful handling of network issues or invalid data, with user-friendly modals.

## Tech Stack

- **Frontend**: React, vanilla CSS 
- **Backend**: Node.js, Express
- **Database**: PostgreSQL with Prisma ORM
- **APIs**: RESTful endpoints for character coordinates, game start, and leaderboard rankings
- **Deployment**: TBC

## Prerequisites

Before you start, ensure you have:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/) installed locally or a hosted instance
- A code editor like [VS Code](https://code.visualstudio.com/)

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/jonorl/wheres-bluey.git
   cd bluey-hide-and-seek
   ```

2. **Set Up the Backend**:
   - Navigate to `/backend`:
     ```bash
     cd backend
     npm install
     ```
   - Create a `.env` file in the backend directory with your database URL:
     ```env
     DATABASE_URL="postgresql://user:password@localhost:5432/bluey_db?schema=public"
     ```
   - Run Prisma migrations to set up the database:
     ```bash
     npx prisma migrate dev --name init
     ```
   - Start the backend server:
     ```bash
     npm start
     ```
     The server runs on `http://localhost:3000` by default.

3. **Set Up the Frontend**:
   - Navigate to the frontend directory (e.g., `/frontend`):
     ```bash
     cd frontend
     npm install
     ```
   - Update API URLs in `frontend/src/ImageSelector.jsx` if your backend is hosted elsewhere:
     ```javascript
     const response = await fetch('https://your-backend-url/api/v1/characters/');
     ```
   - Start the frontend development server:
     ```bash
     npm start
     ```
     The app runs on `http://localhost:3000` (or another port if specified).

4. **Seed the Database** (Optional):
   - Populate the `Characters` table with initial data:
     ```sql
    INSERT INTO "Characters" (id, name, xrange, yrange) VALUES
    (gen_random_uuid(), 'Lucky', '{28,30}', '{30,37}'),
    (gen_random_uuid(), 'Judo', '{59,65}', '{45,58}'),
    (gen_random_uuid(), 'Bluey', '{88,92}', '{24,29}'),
    (gen_random_uuid(), 'Muffin', '{35,41}', '{74,81}'),
    (gen_random_uuid(), 'Lucky''s dad', '{90,94}', '{23,31}'),
    (gen_random_uuid(), 'Bob Bilby', '{36,39}', '{12,17}'),
    (gen_random_uuid(), 'Bingo', '{29,32}', '{15,19}'),
    (gen_random_uuid(), 'Socks', '{65,69}', '{40,51}'),
    (gen_random_uuid(), 'Pelican', '{39,44}', '{17,24}')
     ```

## Usage

1. **Start the Game**:
   - Open the app in your browser (e.g., `http://localhost:3000`).
   - Click the "Start Game" button to begin. This triggers a backend API call to record the start time.

2. **Find the Characters**:
   - Click on the image to open a dropdown menu.
   - Select a character (Socks, Muffin, or Bob Bilby) to check if they’re in that spot.
   - Green checkmarks (✅) indicate a correct find; red crosses (🚫) mean try again!

3. **Complete the Game**:
   - Find all three characters to finish the game.
   - Enter your name in the congratulatory modal to submit your score.

4. **View the Leaderboard**:
   - After submitting, see how your time ranks among the top 10 players.
   - Click "Play Again" to restart.

## API Endpoints

- **GET /api/v1/characters/**: Fetch all character coordinates.
- **POST /api/v1/ranking/start**: Start a new game, returning a unique `id`.
- **POST /api/v1/ranking/**: Update a game entry with player name and end time, calculating duration.
- **GET /api/v1/ranking/:scenario?**: Retrieve the top 10 leaderboard entries (optional scenario filter).

## Project Structure

```
bluey-hide-and-seek/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma       # Database schema
│   ├── src/
│   │   ├── routes/
│   │   │   └── mainRouter.js   # API routes
│   │   ├── db/
│   │   │   └── queries.js      # Database queries
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── assets/             # Images (Bluey scene, character icons)
│   │   ├── ImageSelector.jsx   # Main game component
│   │   └── imageSelector.css   # Custom styles
│   └── package.json
└── README.md
```