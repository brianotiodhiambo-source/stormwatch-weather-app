# ⚡ StormWatch — Weather Intelligence Dashboard

> Built as a technical assessment for WeatherAI. A cinematic, full-stack weather intelligence platform integrating the WeatherAI REST API — real-time forecasts, Gemini AI summaries, canopy analysis, and webhook alert subscriptions.

**Live Demo:** `https://stormwatch.up.railway.app` ← *(replace with your deploy URL)*

---

## What It Does

StormWatch integrates **four WeatherAI API surfaces** into a single, unified dashboard:

| Module | Endpoint(s) | Description |
|---|---|---|
| **Live Weather** | `/v1/weather-geo`, `/v1/weather` | Auto-detects location via IP, fetches current conditions + 7-day forecast |
| **AI Insights** | `/v1/insights` (Pro) | Gemini-powered natural language weather summaries |
| **Canopy Analyzer** | `/v1/trees/analyze` | Upload drone/aerial images → OpenCV tree count + health breakdown |
| **Alert Webhooks** | `/v1/webhooks` | Subscribe to rain, frost, wind, drought triggers on any location |
| **API Quota** | `/v1/usage` | Live usage tracking against monthly limits |

---

## Tech Stack

- **Backend:** Node.js 18+ · Express 4 — API proxy server (keeps key server-side)
- **Frontend:** Vanilla HTML/CSS/JS — zero framework, zero build step
- **Deploy:** Railway / Render / Fly.io (any Node host)

---

## Setup

### 1. Clone

```bash
git clone https://github.com/YOUR_USERNAME/stormwatch.git
cd stormwatch
```

### 2. Install

```bash
npm install
```

### 3. Set your WeatherAI API key

```bash
# Option A — environment variable (recommended for deploy)
export WAI_KEY=wai_your_key_here

# Option B — create a .env file (local dev)
echo "WAI_KEY=wai_your_key_here" > .env
```

Get your free API key at [weather-ai.co](https://weather-ai.co) — takes 60 seconds, no card needed.

### 4. Run

```bash
# Development (auto-restart on file change)
npm run dev

# Production
npm start
```

Open `http://localhost:3000`

---

## Deploy to Railway (Recommended)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login + deploy
railway login
railway init
railway up

# Set API key env var
railway variables set WAI_KEY=wai_your_key_here
```

Or click **Deploy on Railway** and set `WAI_KEY` in the Variables tab.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `WAI_KEY` | ✅ | Your WeatherAI API key (`wai_...`) |
| `PORT` | Optional | Server port (default: 3000) |

---

## API Routes (Backend Proxy)

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/auto` | Weather for auto-detected IP location |
| `GET` | `/api/weather?lat=&lon=&days=` | Weather by coordinates |
| `GET` | `/api/insights?lat=&lon=` | Gemini AI insights (Pro key required) |
| `GET` | `/api/usage` | Monthly quota stats |
| `POST` | `/api/tree-analyze` | Multipart image → canopy analysis |
| `POST` | `/api/webhook` | Create alert webhook subscription |

---

## Notes on API Tiers

- **Free key** — works for weather, forecast, auto-detect, tree analysis (5/mo), usage stats
- **Pro key** — unlocks Gemini AI summaries, 14-day forecasts, webhooks
- **Scale key** — unlocks SMS/USSD gateway

The dashboard gracefully degrades — AI insight cards show an upgrade prompt on Free tier.

---

## Project Structure

```
stormwatch/
├── src/
│   └── server.js       # Express backend + API proxy
├── public/
│   └── index.html      # Single-page frontend
├── package.json
└── README.md
```

---

## Design

Cinematic dark/gold aesthetic — scanline overlay, Bebas Neue typography, surveillance-terminal energy. Built to feel like a serious intelligence tool, not a weather widget.

---

*Built by Davies O. · WeatherAI Technical Assessment · June 2026*
