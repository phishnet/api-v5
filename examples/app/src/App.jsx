import { useState } from 'react';
import Setlists from './Setlists.jsx';
import JamCharts from './JamCharts.jsx';
import Venues from './Venues.jsx';

const TABS = { Setlists, 'Jam Charts': JamCharts, Venues };

export default function App() {
  const [tab, setTab] = useState('Setlists');
  const Tab = TABS[tab];
  return (
    <>
      <header>
        <h1>Phish.net API v5</h1>
        <nav>
          {Object.keys(TABS).map((name) => (
            <button key={name} className={name === tab ? 'active' : ''} onClick={() => setTab(name)}>
              {name}
            </button>
          ))}
        </nav>
      </header>
      <main><Tab /></main>
      <footer>
        Data from <a href="https://phish.net">Phish.net</a> · <a href="https://docs.phish.net">API docs</a>
      </footer>
    </>
  );
}
