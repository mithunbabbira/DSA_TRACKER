# Prep Tracker

Minimal accountability dashboard for **Mithun** and **Devesh** to track daily interview prep and determine the monthly challenge winner.

## Stack

- **Frontend:** React + Tailwind CSS + Recharts
- **Backend:** Node.js + Express
- **Database:** SQLite

## Quick Start

```bash
# Install dependencies
npm install
npm install --prefix server
npm install --prefix client

# Run dev (API on :3001, UI on :5173)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Production

```bash
npm run build
npm start
```

Serves the built UI from the Express server on port 3001.

## Features

- Quick-log DSA, LLD, and HLD sessions
- Productive day tracking with streaks
- Monthly challenge with configurable target & penalties
- Leaderboard comparing both users
- Calendar view with day detail
- Activity feed
- Weekly progress chart (Recharts)
- GitHub-style contribution heatmap
- Achievement badges (7/15/30-day streaks)
- PDF monthly report export

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List users |
| GET/PUT | `/api/settings` | Challenge settings |
| GET/POST | `/api/entries` | Activity entries |
| GET | `/api/stats/:userId` | User monthly stats |
| GET | `/api/leaderboard` | Compare users |
| GET | `/api/challenge` | Monthly outcome |
| GET | `/api/feed` | Activity feed |
| GET | `/api/day/:userId/:date` | Day entries |

## Challenge Rules (default)

- Target: 25 productive days/month
- One fail, one pass → loser pays ₹1000
- Both fail → each contributes ₹1000
- Both pass → no penalty

Configure via the **Challenge Rules** panel in the UI.
