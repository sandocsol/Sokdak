import { useEffect, useMemo, useState } from 'react';

/**
 * 동아리 목록을 가져오는 커스텀 훅
 * @returns {object} { data, loading, error }
 */
export default function useClubs() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dataUrl = useMemo(() => {
    return '/data/clubs.json';
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!dataUrl) return;

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(dataUrl, { headers: { 'Accept': 'application/json' } });

        if (!res.ok) {
          throw new Error(`Failed to load clubs: ${res.status}`);
        }

        const json = await res.json();

        if (!cancelled) setData(json);
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [dataUrl]);

  return { data, loading, error };
}

