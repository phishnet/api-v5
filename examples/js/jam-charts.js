(function () {
  'use strict';

  const listEl = document.getElementById('song-list');
  const filterEl = document.getElementById('filter');
  const titleEl = document.getElementById('song-title');
  const resultsEl = document.getElementById('results');

  let allSongs = [];

  async function loadSongList() {
    try {
      // jamcharts.json (no column/value) returns every jam-charted performance;
      // dedupe by slug to build the song picker.
      const rows = await PhishNet.phishnet('jamcharts');
      const seen = new Set();
      allSongs = [];
      for (const row of rows) {
        if (!seen.has(row.slug)) {
          seen.add(row.slug);
          allSongs.push({ slug: row.slug, song: row.song });
        }
      }
      allSongs.sort((a, b) => a.song.localeCompare(b.song));
      renderList(filterEl.value);
    } catch (err) {
      listEl.innerHTML = `<div class="error-box">${SetlistFormat.escapeHtml(err.message)}</div>`;
    }
  }

  function renderList(filter) {
    const lower = filter.trim().toLowerCase();
    const filtered = lower ? allSongs.filter((s) => s.song.toLowerCase().includes(lower)) : allSongs;
    if (!filtered.length) {
      listEl.innerHTML = '<span class="status">No matching songs.</span>';
      return;
    }
    listEl.innerHTML = filtered
      .map(
        (s) =>
          `<a href="jam-charts.html?slug=${encodeURIComponent(s.slug)}" data-slug="${s.slug}">${SetlistFormat.escapeHtml(
            s.song
          )}</a>`
      )
      .join('');
  }

  async function loadJamChart(slug) {
    listEl.querySelectorAll('a').forEach((a) => a.classList.toggle('active', a.dataset.slug === slug));
    titleEl.innerHTML = '';
    resultsEl.innerHTML = '<p class="status">Loading&hellip;</p>';
    try {
      const rows = await PhishNet.phishnet(`jamcharts/slug/${slug}`, { order_by: 'showdate', direction: 'desc' });
      if (!rows.length) {
        resultsEl.innerHTML = '<p class="status">No jam chart entries found for this song.</p>';
        return;
      }
      titleEl.innerHTML = `
        <h3><a href="https://phish.net/song/${slug}">${SetlistFormat.escapeHtml(rows[0].song)}</a> &mdash; Jam Chart</h3>
        <p><a href="song-explorer.html?slug=${slug}">See every time this song&rsquo;s been played &rarr;</a></p>
      `;
      resultsEl.innerHTML = rows
        .map((row) => {
          const location = [row.city, row.state || row.country].filter(Boolean).join(', ');
          return `
          <div class="jam-entry">
            <h3><a href="setlist-browser.html?date=${row.showdate}">${row.showdate}</a></h3>
            <div class="jam-meta">${SetlistFormat.escapeHtml(row.venue)}${location ? ', ' + SetlistFormat.escapeHtml(location) : ''}${
            row.tracktime ? ' &middot; ' + SetlistFormat.escapeHtml(row.tracktime) : ''
          }</div>
            ${row.jamchart_description ? `<div class="jam-desc">${row.jamchart_description}</div>` : ''}
          </div>`;
          // jamchart_description is rich text supplied by Phish.net (may contain its own
          // links/formatting), so it's rendered as-is rather than escaped -- same treatment
          // as setlistnotes in scripts/setlist-format.js.
        })
        .join('');
    } catch (err) {
      resultsEl.innerHTML = `<div class="error-box">${SetlistFormat.escapeHtml(err.message)}</div>`;
    }
  }

  filterEl.addEventListener('input', () => renderList(filterEl.value));

  listEl.addEventListener('click', (event) => {
    const link = event.target.closest('a[data-slug]');
    if (!link) return;
    event.preventDefault();
    history.replaceState(null, '', `jam-charts.html?slug=${link.dataset.slug}`);
    loadJamChart(link.dataset.slug);
  });

  async function init() {
    await loadSongList();
    const slug = new URLSearchParams(location.search).get('slug');
    if (slug) {
      loadJamChart(slug);
    } else {
      resultsEl.innerHTML = '<p class="status">Pick a song to browse its notable jams.</p>';
    }
  }

  init();
})();
