import { useEffect, useState } from 'react';
import { getGlobalSentRankings, getClubsSentRankings } from '../api/rankingApi.js';

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
        // 두 개의 API를 병렬로 호출
        const [complimentKings, clubRankings] = await Promise.all([
          getGlobalSentRankings(10),
          getClubsSentRankings(10),
        ]);

        if (!cancelled) {
          setData({
            complimentKings: complimentKings || [],
            clubRankings: clubRankings || [],
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

