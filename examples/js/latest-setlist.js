(function () {
  'use strict';

  const container = document.getElementById('setlist');

  function songHref(row) {
    return `song-explorer.html?slug=${encodeURIComponent(row.slug)}`;
  }

  async function load() {
    try {
      const rows = await PhishNet.latestShowRows();
      if (!rows.length) {
        container.innerHTML = '<p class="status">No recent Phish shows found.</p>';
        return;
      }
      const first = rows[0];
      container.innerHTML = `
        <h3>${SetlistFormat.escapeHtml(first.showdate)} &mdash; ${SetlistFormat.showTitleHtml(first)}</h3>
        ${SetlistFormat.renderSetlist(rows, songHref)}
      `;
    } catch (err) {
      container.innerHTML = `<div class="error-box">${SetlistFormat.escapeHtml(err.message)}</div>`;
    }
  }

  load();
})();
