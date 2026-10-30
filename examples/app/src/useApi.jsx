import { useEffect, useState } from 'react';
import { api } from './api.js';

// Returns { data, error, loading } for a path; pass null to skip.
export function useApi(path) {
  const [state, setState] = useState({ data: null, error: null, loading: !!path });
  useEffect(() => {
    if (!path) return setState({ data: null, error: null, loading: false });
    let cancelled = false;
    setState({ data: null, error: null, loading: true });
    api(path)
      .then((data) => !cancelled && setState({ data, error: null, loading: false }))
      .catch((error) => !cancelled && setState({ data: null, error, loading: false }));
    return () => { cancelled = true; };
  }, [path]);
  return state;
}

export function Status({ loading, error }) {
  if (loading) return <p className="status">Loading…</p>;
  if (error) return <p className="status">Error: {error.message}</p>;
  return null;
}
