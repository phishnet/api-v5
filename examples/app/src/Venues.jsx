import { useState } from 'react';
import { useApi, Status } from './useApi.jsx';

const place = (v) => [v.city, v.state, v.country !== 'USA' && v.country].filter(Boolean).join(', ');

export default function Venues() {
  const [filter, setFilter] = useState('');
  const [venue, setVenue] = useState(null);
  const all = useApi('venues.json');
  const shows = useApi(venue && `shows/venueid/${venue.venueid}.json`);

  const q = filter.toLowerCase();
  const matches = [...(all.data ?? [])]
    .sort((a, b) => a.venuename.localeCompare(b.venuename))
    .filter((v) => !q || `${v.venuename} ${place(v)}`.toLowerCase().includes(q))
    .slice(0, 200);
  const phishShows = (shows.data ?? []).filter((s) => s.artistid === 1).sort((a, b) => b.showdate.localeCompare(a.showdate));

  return (
    <div className="two-col">
      <section>
        <input placeholder="Search venue, city, state…" value={filter} onChange={(e) => setFilter(e.target.value)} />
        <Status {...all} />
        <ul className="list">
          {matches.map((v) => (
            <li key={v.venueid}>
              <a className={v.venueid === venue?.venueid ? 'active' : ''} onClick={() => setVenue(v)}>
                {v.venuename}<span>{place(v)}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
      <section>
        {!venue && <p className="status">Pick a venue.</p>}
        {venue && <h2><a href={`https://phish.net/venue/${venue.venueid}`}>{venue.venuename}</a></h2>}
        {venue && <div className="meta">{place(venue)}</div>}
        <Status {...shows} />
        {venue && !shows.loading && <p className="meta">{phishShows.length} show{phishShows.length === 1 ? '' : 's'}</p>}
        {phishShows.map((s) => (
          <div className="row" key={s.showid ?? s.showdate}>
            <a href={s.permalink}>{s.showdate}</a><span>{s.tourname}</span>
          </div>
        ))}
      </section>
    </div>
  );
}
