(function () {
  'use strict';

  const yearSelect = document.getElementById('year-select');
  const dateInput = document.getElementById('date-input');
  const loadBtn = document.getElementById('load-btn');
  const dateListEl = document.getElementById('date-list');
  const setlistEl = document.getElementById('setlist');

  const FIRST_TOUR_YEAR = 1983;
  const currentYear = new Date().getFullYear();

  function songHref(row) {
    return `song-explorer.html?slug=${encodeURIComponent(row.slug)}`;
  }

  function populateYearSelect() {
    const options = ['<option value="">Year&hellip;</option>'];
    for (let year = currentYear; year >= FIRST_TOUR_YEAR; year--) {
      options.push(`<option value="${year}">${year}</option>`);
    }
    yearSelect.innerHTML = options.join('');
  }

  // Distinct shows (one entry per showid) for whichever year is currently selected.
  let yearShows = [];

  function renderDateList(activeDate) {
    if (!yearShows.length) {
      dateListEl.innerHTML = '<span class="status">No Phish shows found for that year.</span>';
      return;
    }
    dateListEl.innerHTML = yearShows
      .map((row) => {
        const activeClass = row.showdate === activeDate ? ' active' : '';
        return `<a href="setlist-browser.html?date=${row.showdate}" data-date="${row.showdate}" class="${activeClass.trim()}">
          ${row.showdate}<span class="item-meta">${SetlistFormat.escapeHtml(row.venue)}</span>
        </a>`;
      })
      .join('');
  }

  async function loadYear(year) {
    dateListEl.innerHTML = '<span class="status">Loading shows&hellip;</span>';
    try {
      const rows = (await PhishNet.phishnet(`setlists/showyear/${year}`, { order_by: 'showdate' })).filter(
        (row) => row.artistid === PhishNet.PHISH_ARTIST_ID
      );
      const seen = new Set();
      yearShows = [];
      for (const row of rows) {
        if (!seen.has(row.showid)) {
          seen.add(row.showid);
          yearShows.push(row);
        }
      }
      renderDateList(dateInput.value);
    } catch (err) {
      dateListEl.innerHTML = `<div class="error-box">${SetlistFormat.escapeHtml(err.message)}</div>`;
    }
  }

  async function loadShow(rows, date) {
    setlistEl.innerHTML = '<p class="status">Loading&hellip;</p>';
    try {
      if (!rows) {
        rows = (await PhishNet.phishnet(`setlists/showdate/${date}`, { order_by: 'showdate' })).filter(
          (row) => row.artistid === PhishNet.PHISH_ARTIST_ID
        );
      }
      if (!rows.length) {
        setlistEl.innerHTML = `<p class="status">No Phish show found on ${SetlistFormat.escapeHtml(date)}.</p>`;
        return;
      }
      const first = rows[0];
      dateInput.value = first.showdate;
      history.replaceState(null, '', `setlist-browser.html?date=${first.showdate}`);
      renderDateList(first.showdate);
      setlistEl.innerHTML = `
        <h3>${SetlistFormat.escapeHtml(first.showdate)} &mdash; ${SetlistFormat.showTitleHtml(first)}</h3>
        <p><a href="venue-explorer.html?id=${first.venueid}">See every Phish show at this venue &rarr;</a></p>
        ${SetlistFormat.renderSetlist(rows, songHref)}
      `;
    } catch (err) {
      setlistEl.innerHTML = `<div class="error-box">${SetlistFormat.escapeHtml(err.message)}</div>`;
    }
  }

  yearSelect.addEventListener('change', () => {
    if (yearSelect.value) loadYear(yearSelect.value);
  });

  dateListEl.addEventListener('click', (event) => {
    const link = event.target.closest('a[data-date]');
    if (!link) return;
    event.preventDefault();
    loadShow(null, link.dataset.date);
  });

  loadBtn.addEventListener('click', () => {
    if (dateInput.value) loadShow(null, dateInput.value);
  });

  async function init() {
    populateYearSelect();
    const requestedDate = new URLSearchParams(location.search).get('date');
    if (requestedDate) {
      dateInput.value = requestedDate;
      yearSelect.value = requestedDate.slice(0, 4);
      await Promise.all([loadYear(yearSelect.value), loadShow(null, requestedDate)]);
      return;
    }
    try {
      const rows = await PhishNet.latestShowRows();
      if (!rows.length) {
        setlistEl.innerHTML = '<p class="status">Pick a year or date above to get started.</p>';
        return;
      }
      yearSelect.value = rows[0].showyear;
      await Promise.all([loadYear(rows[0].showyear), loadShow(rows, rows[0].showdate)]);
    } catch (err) {
      setlistEl.innerHTML = `<div class="error-box">${SetlistFormat.escapeHtml(err.message)}</div>`;
    }
  }

  init();
})();
