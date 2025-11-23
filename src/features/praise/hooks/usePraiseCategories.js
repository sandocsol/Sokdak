import { useEffect, useMemo, useState } from 'react';

/**
 * 칭찬 카테고리 목록을 가져오는 커스텀 훅
 * @returns {object} { data, loading, error }
 */
export default function usePraiseCategories() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dataUrl = useMemo(() => {
    return '/data/praise-categories.json';
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
          throw new Error(`Failed to load praise categories: ${res.status}`);
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

