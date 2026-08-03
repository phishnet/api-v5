#!/usr/bin/env node
/*
 * Zero-dependency local server for the Phish.net API v5 example suite.
 *
 * Serves this folder's static files and proxies /api/* requests to
 * api.phish.net, injecting your API key server-side. That solves two
 * problems at once:
 *
 *  1. api.phish.net sends no Access-Control-Allow-Origin header, so a
 *     browser fetch() straight to it from this page's origin is blocked
 *     before the response body can be read.
 *  2. Its JSONP `callback` response is served with
 *     Content-Type: application/json and X-Content-Type-Options: nosniff,
 *     which modern browsers refuse to execute as a <script> -- so the
 *     JSONP workaround the API's own docs describe doesn't actually work
 *     in a modern browser either (confirmed against the live API).
 *
 * Routing every call through this same-origin proxy sidesteps both, and
 * as a bonus keeps your API key out of client-side JS entirely.
 *
 * Usage: node server.js   (then open http://localhost:8000)
 */
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8000;
const ROOT = __dirname;
const API_HOST = 'api.phish.net';

let apiKey;
try {
  apiKey = require('./scripts/apikey.js');
} catch {
  console.error(
    'Missing scripts/apikey.js. Copy scripts/apikey.example.js to scripts/apikey.js and add your key from https://phish.net/api/keys.'
  );
  process.exit(1);
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

function serveStatic(res, pathname) {
  const safePath = path.normalize(pathname === '/' ? '/index.html' : pathname).replace(/^(\.\.[/\\])+/, '');
  const filePath = path.join(ROOT, safePath);
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Not found: ' + pathname);
    }
    res.writeHead(200, { 'Content-Type': MIME_TYPES[path.extname(filePath)] || 'application/octet-stream' });
    res.end(data);
  });
}

function proxyApi(res, pathname, search) {
  const apiPath = pathname.replace(/^\/api/, '/v5');
  const params = new URLSearchParams(search);
  params.set('apikey', apiKey);
  https
    .get({ hostname: API_HOST, path: `${apiPath}?${params.toString()}`, headers: { Accept: 'application/json' } }, (apiRes) => {
      res.writeHead(apiRes.statusCode, { 'Content-Type': 'application/json' });
      apiRes.pipe(res);
    })
    .on('error', (err) => {
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 1, error_message: err.message, data: [] }));
    });
}

http
  .createServer((req, res) => {
    const { pathname, search } = new URL(req.url, `http://localhost:${PORT}`);
    if (pathname.startsWith('/api/')) return proxyApi(res, pathname, search);
    serveStatic(res, pathname);
  })
  .listen(PORT, () => console.log(`Phish.net API v5 examples running at http://localhost:${PORT}`));
