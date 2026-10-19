# Survival Dash

A full-stack web-based arcade dodge game built with React and Node.js. Players control a character to dodge falling objects and collect power-ups to maximize their score. Features cloud-based score persistence via Snowflake with a localStorage fallback.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Game Mechanics](#game-mechanics)
- [Power-Ups](#power-ups)
- [Scoring System](#scoring-system)
- [API Reference](#api-reference)
- [Data Persistence](#data-persistence)
- [Architecture Overview](#architecture-overview)
- [Known Limitations](#known-limitations)

---

---

## Features

- Arcade-style dodge gameplay with real-time physics
- Dynamic difficulty that scales with score
- Three distinct power-ups (Shield, Double Score, Speed Boost)
- In-game HUD with live stats (score, time, dodge streak, power-ups)
- Cumulative stats tracked across all sessions
- Leaderboard showing the last 10 scores
- Cloud score storage via Snowflake with automatic localStorage fallback
- Fixed-size (600x800) game canvas with smooth animations

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, React Router 7, Vite |
| Backend | Node.js, Express 4 |
| Database | Snowflake (cloud data warehouse) |
| Local Fallback | Browser localStorage |
| Dev Tooling | Vite HMR, Concurrently, ESLint |

---

## Project Structure

```
survival_dash/
├── src/
│   ├── main.jsx                    # React entry point
│   ├── App.jsx                     # Router setup (Home, Game, Leaderboard)
│   ├── pages/
│   │   ├── Home.jsx                # Landing page with cumulative player stats
│   │   ├── Game.jsx                # Game page wrapper
│   │   └── Leaderboard.jsx         # Score history (Snowflake or localStorage)
│   ├── components/
│   │   ├── game/
│   │   │   ├── GameCanvas.jsx      # Core game loop, physics, collision, state
│   │   │   ├── Player.jsx          # Player character rendering
│   │   │   └── FallingObject.jsx   # Hazard object rendering
│   │   ├── PowerUp/
│   │   │   └── PowerUp.jsx         # Power-up item rendering
│   │   └── ui/
│   │       ├── StatsBoard.jsx      # In-game HUD
│   │       ├── GameOverScreen.jsx  # End-of-game modal with final stats
│   │       ├── StartScreen.jsx     # Pre-game start screen
│   │       └── PlayerStatsPanel.jsx
│   ├── engine/
│   │   ├── constants.js            # Game config (dimensions, speeds, types)
│   │   ├── difficulty.js           # Score-based speed scaling
│   │   └── collision.js            # AABB collision detection
│   ├── hooks/
│   │   ├── useGameLoop.js          # requestAnimationFrame hook (not used yet)
│   │   └── usePlayerMovement.js    # Arrow-key hook (not used yet; GameCanvas handles movement)
│   ├── services/
│   │   ├── apiService.js           # Backend API calls (scores)
│   │   └── statsService.js         # localStorage cumulative stats
│   └── analytics/
│       └── eventDispatcher.js      # In-game event logging
├── server/
│   ├── index.js                    # Express app, CORS, health check
│   ├── routes/
│   │   └── scores.js               # GET /api/scores, POST /api/scores
│   └── db/
│       ├── snowflake.js            # Snowflake connection and queries
│       └── schema.sql              # SCORES table definition
├── .env                            # Snowflake credentials (not committed)
├── vite.config.js                  # Vite config with /api proxy to port 3001
├── index.html                      # SPA entry point
└── package.json                    # Scripts and dependencies
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- A Snowflake account (optional — the game works offline with localStorage)

### Installation

```bash
git clone https://github.com/niraj5511/survival_dash.git
cd survival_dash
npm install
```

### Running in Development

```bash
npm run dev
```

This starts both the Vite frontend (port 5173) and the Express backend (port 3001) concurrently. The Vite dev server proxies all `/api` requests to the backend automatically.

### Other Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start frontend + backend together |
| `npm run dev:client` | Start Vite frontend only |
| `npm run dev:server` | Start Express backend only (with hot reload) |
| `npm run build` | Production build (Vite) |
| `npm run preview` | Preview the production build locally |
| `npm start` | Run the Express backend in production mode |
| `npm run lint` | Run ESLint |

---

## Environment Variables

Create a `.env` file in the project root with the following:

```env
SNOWFLAKE_ACCOUNT=your_account_identifier
SNOWFLAKE_USERNAME=your_username
SNOWFLAKE_PASSWORD=your_password
SNOWFLAKE_WAREHOUSE=your_warehouse
SNOWFLAKE_DATABASE=your_database
SNOWFLAKE_SCHEMA=your_schema
PORT=3001
```

If Snowflake credentials are missing or the connection fails, the app automatically falls back to localStorage for score storage. No configuration is required to play the game locally.

---

## Game Mechanics

### Controls

| Key | Action |
|---|---|
| Arrow Left / Arrow Right | Move player horizontally |

### Objective

Survive as long as possible by dodging red falling shapes. The longer you survive and the more objects you dodge, the higher your score. Collect power-ups to gain temporary advantages.

### Difficulty Scaling

Falling object speed increases continuously as your score grows:

```
speed = 2 + score * 0.02
```

Object spawn rate is fixed at ~2% per frame. The game becomes progressively harder the longer you survive.

### Game Objects

Hazards are randomly shaped (circle, square, triangle), rendered in red, and fall from the top of the canvas. A single collision ends the game — unless you have an active Shield.

---

## Power-Ups

Power-ups appear randomly at ~0.5% per frame and must be collected by moving the player into them.

| Icon | Name | Effect | Duration |
|---|---|---|---|
| Shield | Shield | Blocks the next collision | 3 seconds |
| 2x | Double Score | Doubles all score gains | 5 seconds |
| Speed Boost | Speed Boost | Increases player speed from 8 to 14 | 3 seconds |

Collecting a power-up also awards bonus points: +10, or +20 if you pick up a Double Score power-up while Double Score is already active.

---

## Scoring System

| Event | Points |
|---|---|
| Surviving each frame | +0.05 |
| Surviving each frame (Double Score active) | +0.10 |
| Collecting a power-up | +10 |
| Collecting a Double Score power-up while Double Score is active | +20 |

Score is displayed rounded to the nearest integer on the HUD and leaderboard.

---

## API Reference

The Express backend exposes two endpoints under `/api/scores`.

### `GET /api/scores`

Returns the 10 most recent scores from Snowflake, newest first.

**Response:**
```json
{
  "scores": [
    {
      "score": 142,
      "date": "2025-01-15T10:30:00Z",
      "timeSurvived": 48.3,
      "objectsDodged": 31
    }
  ]
}
```

Returns `503` if Snowflake is unavailable.

### `POST /api/scores`

Saves a new score entry to Snowflake.

**Request body:**
```json
{
  "score": 142.5,
  "timeSurvived": 48.3,
  "objectsDodged": 31
}
```

**Response:** `201 Created` with `{ "success": true }`. Returns `400` if `score` is missing, or `503` if Snowflake is unavailable. `timeSurvived` and `objectsDodged` default to `0`.

### `GET /api/health`

Health check endpoint. Returns `{ "status": "ok" }` if the server is running.

---

## Data Persistence

The app uses a two-layer persistence strategy:

**Snowflake (primary):**
- Scores are saved asynchronously after each game ends (non-blocking)
- The SCORES table is created automatically on first server start
- The leaderboard fetches from Snowflake when the backend is reachable

**localStorage (fallback):**
- `gameStats` — Cumulative stats: games played, highest score, total score, best streak, longest time, total objects dodged, total power-ups
- `scores` — Last 10 scores (used as leaderboard fallback)
- `events` — Last 500 analytics events (for debugging)

If Snowflake is unreachable, the leaderboard automatically displays localStorage data, and game saves continue locally without any interruption to gameplay.

---

## Architecture Overview

```
Browser
  └── React SPA (Vite, port 5173)
        ├── /          → Home page (stats + play button)
        ├── /game      → Game canvas + HUD
        └── /leaderboard → Score history

        API requests proxied to:

Express Server (port 3001)
  └── /api/scores  →  Snowflake Cloud Database
  └── /api/health
```

**Game loop:** `GameCanvas.jsx` drives the entire game using `requestAnimationFrame`. Falling objects and power-ups are stored in React refs, while score, time, streak, active power-ups, and the player position are kept in React state. The loop updates score, time, and a tick counter on every frame, so the game component re-renders each frame.

**Collision detection:** Uses axis-aligned bounding box (AABB) overlap checks between the player rectangle and each falling object or power-up on every frame.

---

## Known Limitations

- Game speed is tied to frames, not time. On displays with a refresh rate above 60 Hz, objects fall and score accumulates faster.
- `POST /api/scores` has no validation or authentication, and CORS is open, so anyone who can reach the server can submit any score.
- `npm start` runs only the Express API. It does not serve the built frontend, and the `/api` proxy in `vite.config.js` exists only in development. For deployment, host the frontend separately and route `/api` to the backend.
- The leaderboard shows the 10 most recent scores, not the 10 highest.
- Controls are keyboard-only (Arrow Left / Arrow Right).

---
