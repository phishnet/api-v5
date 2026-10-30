import { useState } from 'react';
import { useApi, Status } from './useApi.jsx';

const THIS_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: THIS_YEAR - 1982 }, (_, i) => THIS_YEAR - i);
const SET_LABELS = { e: 'Encore', e2: 'Encore 2', e3: 'Encore 3' };
const setLabel = (s) => SET_LABELS[s] ?? `Set ${s}`;

export default function Setlists() {
  const [year, setYear] = useState(THIS_YEAR);
  const [date, setDate] = useState(null);
  const shows = useApi(`shows/showyear/${year}.json`);
  const setlist = useApi(date && `setlists/showdate/${date}.json`);

  const phishShows = (shows.data ?? []).filter((s) => s.artistid === 1);
  const sets = [];
  for (const row of setlist.data ?? []) {
    const last = sets[sets.length - 1];
    if (last && last.set === row.set) last.songs.push(row);
    else sets.push({ set: row.set, songs: [row] });
  }
  const info = setlist.data?.[0];

  return (
    <div className="two-col">
      <section>
        <select value={year} onChange={(e) => { setYear(+e.target.value); setDate(null); }}>
          {YEARS.map((y) => <option key={y}>{y}</option>)}
        </select>
        <Status {...shows} />
        <ul className="list">
          {phishShows.map((s) => (
            <li key={s.showdate}>
              <a className={s.showdate === date ? 'active' : ''} onClick={() => setDate(s.showdate)}>
                {s.showdate}<span>{s.venue}, {s.city}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
      <section>
        {!date && <p className="status">Pick a show.</p>}
        <Status {...setlist} />
        {info && (
          <>
            <h2><a href={info.permalink}>{info.showdate} — {info.venue}, {info.city}, {info.state}</a></h2>
            {sets.map(({ set, songs }) => (
              <p key={set}>
                <b>{setLabel(set)}:</b>{' '}
                {songs.map((n, i) => (
                  <span key={i} className={n.isjamchart ? 'jam' : ''} title={n.jamchart_description || n.song}>
                    {n.song}{n.trans_mark}{' '}
                  </span>
                ))}
              </p>
            ))}
            {info.setlistnotes?.trim() && <p className="notes" dangerouslySetInnerHTML={{ __html: info.setlistnotes }} />}
          </>
        )}
      </section>
    </div>
  );
}
