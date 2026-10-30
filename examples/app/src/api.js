// All requests go to our own proxy (server/index.js), never api.phish.net.
export async function api(path) {
  const res = await fetch(`/api/${path}`);
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  const json = await res.json();
  return json.data ?? [];
}
