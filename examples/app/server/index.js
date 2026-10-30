// Proxy for the Phish.net API. The browser calls /api/<path>; this server adds
// the X-API-KEY header, so the key never reaches client code.
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { API, isAllowed } from './allowlist.js';

const key = process.env.PHISHNET_API_KEY;
if (!key) {
  console.error('PHISHNET_API_KEY is not set (see .env.example)');
  process.exit(1);
}

const app = express();

app.get('/api/*', async (req, res) => {
  const upstreamPath = req.params[0];
  if (!isAllowed(upstreamPath)) {
    return res.status(404).json({ error: 'Not allowed' });
  }
  try {
    const upstream = await fetch(`${API}/${upstreamPath}`, {
      headers: { 'X-API-KEY': key },
    });
    res.status(upstream.status).type('json').send(await upstream.text());
  } catch {
    res.status(502).json({ error: 'Upstream request failed' });
  }
});

// In production, also serve the built UI.
const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), '../dist');
app.use(express.static(dist));

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Proxy listening on http://localhost:${port}`));
