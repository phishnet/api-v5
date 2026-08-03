/*
 * Shared rendering helpers for pages that display setlists
 * (examples/latest-setlist.html and examples/setlist-browser.html).
 * Plain <script>, see scripts/phishnet-client.js for why.
 */
window.SetlistFormat = (function () {
  'use strict';

  const SET_LABELS = { 1: 'Set 1', 2: 'Set 2', 3: 'Set 3', 4: 'Set 4', e: 'Encore', e2: 'Encore 2', e3: 'Encore 3' };

  function setLabel(set) {
    return SET_LABELS[set] || `Set ${set}`;
  }

  function escapeHtml(value) {
    if (value == null) return '';
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /** Groups flat setlist rows (one row per song) by their `set` field, preserving order. */
  function groupBySet(rows) {
    const sets = new Map();
    for (const row of rows) {
      if (!sets.has(row.set)) sets.set(row.set, []);
      sets.get(row.set).push(row);
    }
    return sets;
  }

  /**
   * Renders the setlist for a single show (all rows sharing one showid) as an HTML string.
   * Songs that are on the Jam Chart are marked and get their jam description as a tooltip.
   * `songHref(row)` builds the link target for a song (callers point this at their own
   * song-explorer/jam-charts pages so the two examples stay cross-linked).
   */
  function renderSetlist(rows, songHref) {
    const sets = groupBySet(rows);
    let html = '';
    for (const [set, songs] of sets) {
      const line = songs
        .map((row) => {
          const label = escapeHtml(row.song);
          const href = songHref(row);
          const jamAttrs =
            row.isjamchart == 1 ? ` class="jam-song" title="${escapeHtml(row.jamchart_description || 'Notable jam')}"` : '';
          return `<a href="${href}"${jamAttrs}>${label}</a>${row.trans_mark || ''}`;
        })
        .join('');
      html += `<h4>${setLabel(set)}</h4><p class="setlist-line">${line}</p>`;
    }

    const notes = (rows[0].setlistnotes || '').trim();
    // setlistnotes is rich text supplied by Phish.net (can contain its own <a>/<i> tags),
    // so it's rendered as-is rather than escaped, same as the API's own JSONP example does.
    if (notes) html += `<div class="setlist-notes">${notes}</div>`;
    return html;
  }

  function showTitleHtml(row) {
    const permalink = row.permalink && row.permalink.startsWith('http') ? row.permalink : `https://phish.net/setlists/${row.permalink}`;
    const location = [row.city, row.state, row.country && row.country !== 'USA' ? row.country : null].filter(Boolean).join(', ');
    return `<a href="${permalink}">${escapeHtml(row.venue)}</a> <span class="show-location">${escapeHtml(location)}</span>`;
  }

  return { setLabel, escapeHtml, groupBySet, renderSetlist, showTitleHtml };
})();
