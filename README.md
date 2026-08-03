# Phish.net API v5 Examples

## What's This?

A from-scratch example suite showing how to fetch and display data from the [Phish.net API v5](https://docs.phish.net) using plain HTML, CSS, and JavaScript &mdash; no framework, no build step, no dependencies beyond the browser itself.

## Examples

- **Latest Setlist** &mdash; the simplest possible example: one API call, rendered.
- **Setlist Browser** &mdash; browse by year or jump to a date, with jam-chart highlighting and links out to songs and venues.
- **Song Explorer** &mdash; search every song Phish has played; see debut date, times played, and full performance history.
- **Jam Chart Explorer** &mdash; browse Phish.net's curated list of notable jams, song by song.
- **Venue Explorer** &mdash; search every venue Phish has played and see the show history at each one.

The five pages cross-link to each other (a song in a setlist links to its Song Explorer entry, a venue links to Venue Explorer, a jam-charted date links to Setlist Browser, etc.), so the suite behaves like one small site rather than five disconnected demos.

## Setup

1. Clone or download this repo.
2. Request a free API key at [phish.net/api/keys](https://phish.net/api/keys).
3. Copy `scripts/apikey.example.js` to `scripts/apikey.js` and paste in your key.
4. Run `node server.js` (or `npm start`), then open [http://localhost:8000](http://localhost:8000).

This needs Node installed, but nothing else &mdash; `server.js` has zero dependencies, so there's no `npm install` step.

## How It Works

Every page loads two shared, dependency-free scripts from `scripts/`:

- `phishnet-client.js` &mdash; a small client with one function, `PhishNet.phishnet(path, params)`, that `fetch()`es the API (through the local proxy) and resolves with its `data` array (or throws with a readable message on error).
- `setlist-format.js` &mdash; shared HTML rendering for setlists, used by both the Latest Setlist and Setlist Browser pages.

Each example's own logic lives in `examples/js/<example>.js`.

### Why this needs a local server at all

api.phish.net does not send `Access-Control-Allow-Origin` headers (confirmed by hand against the live API, including an OPTIONS preflight). That means a cross-origin `fetch()` call from a page hosted anywhere other than api.phish.net itself is blocked by the browser before the response body can even be read.

The API's own documented workaround for this &mdash; a `callback` parameter for [JSONP](https://docs.phish.net/callbacks) &mdash; turns out not to work in a modern browser either. Tested against the live API with a real key: the response body **is** correctly wrapped (`myCallback({"error":false,...})`), but it's served with `Content-Type: application/json` and `X-Content-Type-Options: nosniff`. Chrome, Firefox, and Safari all refuse to execute a `<script>` tag under those headers, so the callback never fires &mdash; the request just silently fails. This is very likely why the pre-2.0 version of this repo, which used exactly this JSONP pattern, stopped working in modern browsers.

`server.js` sidesteps both problems: it serves these static files and proxies `/api/*` requests to api.phish.net server-side, where neither CORS nor the nosniff/script restriction applies. The browser-side code is just plain `fetch()` against the local proxy, and as a bonus your API key never has to leave the server or appear in client-side JS.

If you're calling the Phish.net API from your own server (Node, PHP, Python, etc.) rather than a browser, none of this applies to you &mdash; a plain HTTPS GET works fine there.

## Project Structure

```
server.js                      Static file server + API proxy (run this)
package.json                   `npm start` shortcut for server.js
index.html                     Landing page with links to examples
style.css                      Shared styles (light/dark mode aware)
scripts/
  apikey.example.js            API key template (copy to apikey.js); read only by server.js
  phishnet-client.js           fetch()-based API client
  setlist-format.js            Shared setlist rendering helpers
examples/
  latest-setlist.html          Simplest example: most recent setlist
  setlist-browser.html         Year/date navigation, full setlist view
  song-explorer.html           Song search + every-time-played history
  jam-charts.html              Jam Chart browsing by song
  venue-explorer.html          Venue search + show history
  js/                          One script per example, matching filenames above
```

## License

This code is free as in beer &mdash; use it or modify it as you wish, no attribution required.

## Disclaimer

The Mockingbird Foundation and Phish.net make no warranties about this code and are not responsible for any effects that may come from use of it.
