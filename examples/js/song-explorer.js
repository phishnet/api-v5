(function () {
  'use strict';

  const listEl = document.getElementById('song-list');
  const filterEl = document.getElementById('filter');
  const titleEl = document.getElementById('song-title');
  const resultsEl = document.getElementById('results');

  let allSongs = [];

  function renderList(filter) {
    const lower = filter.trim().toLowerCase();
    const filtered = lower ? allSongs.filter((s) => s.song.toLowerCase().includes(lower)) : allSongs;
    if (!filtered.length) {
      listEl.innerHTML = '<span class="status">No matching songs.</span>';
      return;
    }
    listEl.innerHTML = filtered
      .slice(0, 200)
      .map(
        (s) => `<a href="song-explorer.html?slug=${encodeURIComponent(s.slug)}" data-slug="${s.slug}">
          ${SetlistFormat.escapeHtml(s.song)}<span class="item-meta">${s.times_played || 0}&times;</span>
        </a>`
      )
      .join('');
  }

  async function loadSongList() {
    try {
      allSongs = (await PhishNet.phishnet('songs')).sort((a, b) => a.song.localeCompare(b.song));
      renderList(filterEl.value);
    } catch (err) {
      listEl.innerHTML = `<div class="error-box">${SetlistFormat.escapeHtml(err.message)}</div>`;
    }
  }

  async function loadSong(slug) {
    listEl.querySelectorAll('a').forEach((a) => a.classList.toggle('active', a.dataset.slug === slug));
    resultsEl.innerHTML = '<p class="status">Loading&hellip;</p>';
    try {
      // setlists/slug/<slug> returns every performance of this song, one row per show.
      const rows = await PhishNet.phishnet(`setlists/slug/${slug}`, { order_by: 'showdate' });
      if (!rows.length) {
        titleEl.innerHTML = '';
        resultsEl.innerHTML = '<p class="status">No performances found.</p>';
        return;
      }
      const meta = allSongs.find((s) => s.slug === slug);
      const name = meta ? meta.song : rows[0].song;
      titleEl.innerHTML = `<h3><a href="https://phish.net/song/${slug}">${SetlistFormat.escapeHtml(name)}</a></h3>`;

      const jamCount = rows.filter((r) => r.isjamchart == 1).length;
      const statsBits = [`${rows.length} time${rows.length === 1 ? '' : 's'} played`];
      if (jamCount) statsBits.push(`${jamCount} on the Jam Chart`);
      if (meta && meta.debut) {
        statsBits.push(`debuted <a href="setlist-browser.html?date=${meta.debut}">${SetlistFormat.escapeHtml(meta.debut)}</a>`);
      }
      if (meta && meta.last_played && meta.last_played !== meta.debut) {
        statsBits.push(
          `last played <a href="setlist-browser.html?date=${meta.last_played}">${SetlistFormat.escapeHtml(meta.last_played)}</a>`
        );
      }

      resultsEl.innerHTML = `
        <p class="result-count">${statsBits.join(' &middot; ')}</p>
        <table class="data-table">
          <thead><tr><th>Date</th><th>Venue</th><th>Set</th><th>Gap</th></tr></thead>
          <tbody>
            ${rows
              .slice()
              .reverse()
              .map((row) => {
                const location = [row.city, row.state || row.country].filter(Boolean).join(', ');
                const setCell =
                  row.isjamchart == 1
                    ? `<a class="jam-song" href="jam-charts.html?slug=${slug}" title="${SetlistFormat.escapeHtml(
                        row.jamchart_description || 'Notable jam'
                      )}">${SetlistFormat.setLabel(row.set)}</a>`
                    : SetlistFormat.setLabel(row.set);
                return `<tr>
                  <td><a href="setlist-browser.html?date=${row.showdate}">${row.showdate}</a></td>
                  <td>${SetlistFormat.escapeHtml(row.venue)}${location ? ', ' + SetlistFormat.escapeHtml(location) : ''}</td>
                  <td>${setCell}</td>
                  <td>${row.gap ?? ''}</td>
                </tr>`;
              })
              .join('')}
          </tbody>
        </table>
      `;
    } catch (err) {
      resultsEl.innerHTML = `<div class="error-box">${SetlistFormat.escapeHtml(err.message)}</div>`;
    }
  }

  filterEl.addEventListener('input', () => renderList(filterEl.value));

  listEl.addEventListener('click', (event) => {
    const link = event.target.closest('a[data-slug]');
    if (!link) return;
    event.preventDefault();
    history.replaceState(null, '', `song-explorer.html?slug=${link.dataset.slug}`);
    loadSong(link.dataset.slug);
  });

  async function init() {
    await loadSongList();
    const slug = new URLSearchParams(location.search).get('slug');
    if (slug) {
      loadSong(slug);
    } else {
      resultsEl.innerHTML = '<p class="status">Pick a song to see every time it&rsquo;s been played.</p>';
    }
  }

  init();
})();
