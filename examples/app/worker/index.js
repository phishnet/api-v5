// Cloudflare Worker: same job as server/index.js. Static files in dist/ are
// served by the assets binding; only /api/* runs this code.
import { API, isAllowed } from '../server/allowlist.js';

export default {
  async fetch(request, env) {
    const path = new URL(request.url).pathname.replace(/^\/api\//, '');
    if (request.method !== 'GET' || !isAllowed(path)) {
      return Response.json({ error: 'Not allowed' }, { status: 404 });
    }

    // Per-IP limit so a public demo can't burn through the API key's quota.
    const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
    const { success } = await env.LIMITER.limit({ key: ip });
    if (!success) return Response.json({ error: 'Rate limited' }, { status: 429 });

    // Phish data is public and changes slowly: cache upstream responses at the
    // edge so repeat requests don't count against the quota at all.
    const upstream = await fetch(`${API}/${path}`, {
      headers: { 'X-API-KEY': env.PHISHNET_API_KEY },
      cf: { cacheTtl: 3600, cacheEverything: true },
    });
    return new Response(upstream.body, {
      status: upstream.status,
      headers: { 'Content-Type': 'application/json' },
    });
  },
};
