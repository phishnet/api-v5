# Phish.net API v5 Examples

## What's This?

These are files illustrating example uses of version 5 of the [Phish.net API](https://docs.phish.net). There are a virtually unlimited number of ways to utilize this data within your own projects — these examples focus on browser and website-based usage, and will continue to be updated with new uses.

## Examples

- **Setlist Browser** — interactive JSONP-based setlist viewer with year navigation and song lookup
- **Recent Setlists** — fetch and display the current year's setlists using `fetch()`
- **Jam Chart Explorer** — browse notable jams by song
- **Venue Explorer** — search venues and see every show played there

## Setup

1. Clone or download this repo.
2. Copy `scripts/apikey.example.js` to `scripts/apikey.js` and add your API key.  
   You can request a key at [phish.net/api](https://phish.net/api).
3. Open `index.html` in your browser (or serve the folder with any static server).

## Project Structure

```
index.html                  Landing page with links to examples
style.css                   Shared styles
scripts/
  apikey.example.js         API key template (copy to apikey.js)
  setlist.js                JSONP callback: render a single setlist
  song-list.js              JSONP callback: "every time played" table
  year-load.js              JSONP callback: show dates for a year
  venues.js                 JSONP callback: venue show history
  display_showyears.js      JSONP callback: year navigation
examples/
  setlist-browser.html      Interactive setlist browser
  recent-setlists.html      Current year setlists via fetch()
  jam-chart.html            Jam chart explorer
  venue-explorer.html       Venue search and show history
```

## License

This code is free as in beer — use it or modify it as you wish, no attribution required.

## Disclaimer

The Mockingbird Foundation and Phish.net make no warranties about this code and are not responsible for any effects that may come from use of it.
