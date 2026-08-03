(function () {
  'use strict';

  const listEl = document.getElementById('venue-list');
  const filterEl = document.getElementById('filter');
  const titleEl = document.getElementById('venue-title');
  const metaEl = document.getElementById('venue-meta');
  const resultsEl = document.getElementById('results');

  let allVenues = [];

  function venueLocation(venue) {
    return [venue.city, venue.state, venue.country && venue.country !== 'USA' ? venue.country : null].filter(Boolean).join(', ');
  }

  async function loadVenueList() {
    try {
      // venues.json (no column/value) returns every venue Phish.net tracks -- a few
      // thousand rows, small enough to fetch once and filter client-side.
      allVenues = (await PhishNet.phishnet('venues')).sort((a, b) => a.venuename.localeCompare(b.venuename));
      renderList(filterEl.value);
    } catch (err) {
      listEl.innerHTML = `<div class="error-box">${SetlistFormat.escapeHtml(err.message)}</div>`;
    }
  }

  function renderList(filter) {
    const lower = filter.trim().toLowerCase();
    const filtered = lower
      ? allVenues.filter(
          (v) =>
            (v.venuename || '').toLowerCase().includes(lower) ||
            (v.city || '').toLowerCase().includes(lower) ||
            (v.state || '').toLowerCase().includes(lower) ||
            (v.country || '').toLowerCase().includes(lower)
        )
      : allVenues.slice(0, 100);
    if (!filtered.length) {
      listEl.innerHTML = '<span class="status">No matching venues.</span>';
      return;
    }
    listEl.innerHTML = filtered
      .slice(0, 200)
      .map(
        (v) => `<a href="venue-explorer.html?id=${v.venueid}" data-id="${v.venueid}">
          ${SetlistFormat.escapeHtml(v.venuename)}<span class="item-meta">${SetlistFormat.escapeHtml(venueLocation(v))}</span>
        </a>`
      )
      .join('');
  }

  async function loadVenue(id) {
    listEl.querySelectorAll('a').forEach((a) => a.classList.toggle('active', a.dataset.id === String(id)));
    const venue = allVenues.find((v) => String(v.venueid) === String(id));
    titleEl.innerHTML = venue ? `<h3>${SetlistFormat.escapeHtml(venue.venuename)}</h3>` : '';
    metaEl.textContent = venue ? venueLocation(venue) : '';
    resultsEl.innerHTML = '<p class="status">Loading shows&hellip;</p>';
    try {
      const rows = (await PhishNet.phishnet(`shows/venueid/${id}`, { order_by: 'showdate', direction: 'desc' })).filter(
        (row) => row.artistid === PhishNet.PHISH_ARTIST_ID
      );
      if (!rows.length) {
        resultsEl.innerHTML = '<p class="status">No Phish shows found at this venue.</p>';
        return;
      }
      resultsEl.innerHTML = `
        <p class="result-count">${rows.length} show${rows.length === 1 ? '' : 's'}</p>
        <table class="data-table">
          <thead><tr><th>Date</th><th>Tour</th></tr></thead>
          <tbody>
            ${rows
              .map(
                (row) => `<tr>
                  <td><a href="setlist-browser.html?date=${row.showdate}">${row.showdate}</a></td>
                  <td>${SetlistFormat.escapeHtml(row.tour_name || '')}</td>
                </tr>`
              )
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
    const link = event.target.closest('a[data-id]');
    if (!link) return;
    event.preventDefault();
    history.replaceState(null, '', `venue-explorer.html?id=${link.dataset.id}`);
    loadVenue(link.dataset.id);
  });

  async function init() {
    await loadVenueList();
    const id = new URLSearchParams(location.search).get('id');
    if (id) {
      loadVenue(id);
    } else {
      resultsEl.innerHTML = '<p class="status">Pick a venue to see its Phish show history.</p>';
    }
  }

  init();
})();
