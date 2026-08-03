/*
 * Client for the Phish.net API v5 (https://docs.phish.net), routed through
 * this project's local proxy (see server.js) rather than called directly.
 *
 * Why not call api.phish.net straight from the browser: it sends no
 * Access-Control-Allow-Origin header, so a cross-origin fetch() is blocked
 * before the response body can be read. The API's documented JSONP
 * `callback` workaround (https://docs.phish.net/callbacks) doesn't help
 * either -- its callback-wrapped response is still served as
 * Content-Type: application/json with X-Content-Type-Options: nosniff,
 * which modern browsers refuse to execute as a <script> (confirmed against
 * the live API). Routing through server.js sidesteps both: the browser
 * only ever talks to its own origin, and the proxy calls the real API
 * server-side, where none of this applies.
 *
 * Loaded as a plain <script> (not a module) for simplicity across every
 * example page.
 */
window.PhishNet = (function () {
  'use strict';

  // https://docs.phish.net/errors
  const ERROR_MESSAGES = {
    1: 'General API error.',
    2: 'Invalid API key. Check scripts/apikey.js against your key at https://phish.net/api.',
    4: 'Rate limit reached. Wait a moment and try again.',
    7: 'Invalid API method.',
    8: 'Invalid input data: a required parameter was missing or out of bounds.',
    10: 'Invalid protocol: API connections must be made over HTTPS.',
    11: 'No data matched that query.',
    12: 'Access denied.',
  };

  /**
   * Calls a Phish.net API v5 method (via the local proxy) and resolves
   * with its `data` array.
   *
   * `path` is the method (and optional column/value) portion of the URL,
   * e.g. "shows/showyear/1997" or "setlists/showdate/1997-11-22".
   * `params` are extra query-string args like order_by, direction, limit.
   */
  async function phishnet(path, params = {}) {
    const query = new URLSearchParams(params);
    let res;
    try {
      res = await fetch(`/api/${path}.json?${query.toString()}`);
    } catch {
      throw new Error('Could not reach the local proxy. Is server.js running? (node server.js)');
    }
    const json = await res.json();
    if (json.error) {
      throw new Error(ERROR_MESSAGES[json.error] || json.error_message || `API error ${json.error}`);
    }
    return json.data;
  }

  // Phish's own artistid in the shows/setlists tables. Phish.net also
  // tracks solo/side projects (Trey Anastasio Band, etc.) under other
  // artist IDs in the same endpoints, so examples that want Phish-only
  // results filter on this.
  const PHISH_ARTIST_ID = 1;

  /**
   * Finds the most recent Phish show by scanning back one year at a time.
   * Used as the default view for pages that show "the latest setlist."
   * Returns the setlist rows for that show (empty array if none found).
   */
  async function latestShowRows() {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= currentYear - 3; year--) {
      const rows = (await phishnet(`setlists/showyear/${year}`, { order_by: 'showdate' })).filter(
        (row) => row.artistid === PHISH_ARTIST_ID
      );
      if (rows.length) {
        const lastShowId = rows[rows.length - 1].showid;
        return rows.filter((row) => row.showid === lastShowId);
      }
    }
    return [];
  }

  return { phishnet, latestShowRows, PHISH_ARTIST_ID };
})();
