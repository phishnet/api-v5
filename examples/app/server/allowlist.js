// Only these upstream paths can be requested, so the proxy isn't an open relay.
export const API = 'https://api.phish.net/v5';

export const ALLOWED = [
  /^shows\/showyear\/\d{4}\.json$/,
  /^shows\/venueid\/\d+\.json$/,
  /^setlists\/showdate\/\d{4}-\d{2}-\d{2}\.json$/,
  /^setlists\/slug\/[a-z0-9-]+\.json$/,
  /^jamcharts\.json$/,
  /^jamcharts\/slug\/[a-z0-9-]+\.json$/,
  /^venues\.json$/,
];

export const isAllowed = (path) => ALLOWED.some((re) => re.test(path));
