const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const WAI_KEY = process.env.WAI_KEY || 'wai_YOUR_API_KEY_HERE';
const BASE = 'https://api.weather-ai.co';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

async function wai(endpoint, params = {}) {
  const url = new URL(`${BASE}${endpoint}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${WAI_KEY}` }
  });
  if (!res.ok) {
    const err = await res.text();
    throw { status: res.status, message: err };
  }
  return res.json();
}

// Auto-detect location + weather
app.get('/api/auto', async (req, res) => {
  try {
    const data = await wai('/v1/weather-geo', { ip: 'auto', days: 7, ai: 'true', units: 'metric' });
    res.json(data);
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message || 'Failed' });
  }
});

// Weather by coordinates
app.get('/api/weather', async (req, res) => {
  const { lat, lon, days = 7 } = req.query;
  if (!lat || !lon) return res.status(400).json({ error: 'lat and lon required' });
  try {
    const data = await wai('/v1/weather', { lat, lon, days, ai: 'true', units: 'metric' });
    res.json(data);
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message || 'Failed' });
  }
});

// Weather by city name (geo endpoint)
app.get('/api/city', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'q required' });
  try {
    const data = await wai('/v1/weather-geo', { ip: 'auto', days: 7, ai: 'true', units: 'metric' });
    res.json(data);
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message || 'Failed' });
  }
});

// AI Insights
app.get('/api/insights', async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) return res.status(400).json({ error: 'lat and lon required' });
  try {
    const data = await wai('/v1/insights', { lat, lon, days: 7, units: 'metric' });
    res.json(data);
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message || 'Failed' });
  }
});

// Tree analysis — multipart proxy
app.post('/api/tree-analyze', async (req, res) => {
  try {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', async () => {
      const body = Buffer.concat(chunks);
      const contentType = req.headers['content-type'];

      const response = await fetch(`${BASE}/v1/trees/analyze`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${WAI_KEY}`,
          'Content-Type': contentType
        },
        body
      });

      const data = await response.json();
      res.status(response.status).json(data);
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Usage stats
app.get('/api/usage', async (req, res) => {
  try {
    const data = await wai('/v1/usage');
    res.json(data);
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message || 'Failed' });
  }
});

// Webhook create
app.post('/api/webhook', async (req, res) => {
  try {
    const response = await fetch(`${BASE}/v1/webhooks`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${WAI_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n  ⚡ STORMWATCH SERVER — PORT ${PORT}`);
  console.log(`  API Key: ${WAI_KEY.slice(0, 10)}...`);
  console.log(`  http://localhost:${PORT}\n`);
});
