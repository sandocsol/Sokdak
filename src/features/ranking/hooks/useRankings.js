import { useEffect, useState } from 'react';
import { getRankings } from '../api/rankingApi.js';

/**
 * 랭킹 데이터를 가져오는 커스텀 훅
 * @returns {object} { data, loading, error }
 * data 구조: { complimentKings: [], clubRankings: [] }
 */
export default function useRankings() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const result = await getRankings();
        if (!cancelled) {
          setData({
            complimentKings: result.complimentKings || [],
            clubRankings: result.clubRankings || []
          });
        }
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
  }, []);

  return { data, loading, error };
}

