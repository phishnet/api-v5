import { useMemo, useState } from 'react';
import { useApi, Status } from './useApi.jsx';

export default function JamCharts() {
  const [filter, setFilter] = useState('');
  const [song, setSong] = useState(null);
  const all = useApi('jamcharts.json');
  const entries = useApi(song && `jamcharts/slug/${song.slug}.json`);

  const songs = useMemo(() => {
    const bySlug = new Map();
    for (const j of all.data ?? []) bySlug.set(j.slug, { slug: j.slug, song: j.song });
    return [...bySlug.values()].sort((a, b) => a.song.localeCompare(b.song));
  }, [all.data]);
  const shown = songs.filter((s) => s.song.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="two-col">
      <section>
        <input placeholder="Filter songs…" value={filter} onChange={(e) => setFilter(e.target.value)} />
        <Status {...all} />
        <ul className="list">
          {shown.map((s) => (
            <li key={s.slug}>
              <a className={s.slug === song?.slug ? 'active' : ''} onClick={() => setSong(s)}>{s.song}</a>
            </li>
          ))}
        </ul>
      </section>
      <section>
        {!song && <p className="status">Pick a song.</p>}
        {song && <h2><a href={`https://phish.net/song/${song.slug}`}>{song.song}</a> — Jam Chart</h2>}
        <Status {...entries} />
        {(entries.data ?? []).map((j) => (
          <div className="entry" key={j.showdate + j.song}>
            <h3><a href={j.permalink}>{j.showdate}</a></h3>
            <div className="meta">{[j.venue, j.city, j.state].filter(Boolean).join(', ')}{j.tracktime && ` · ${j.tracktime}`}</div>
            {j.jamchart_description && <p>{j.jamchart_description}</p>}
          </div>
        ))}
      </section>
    </div>
  );
}
