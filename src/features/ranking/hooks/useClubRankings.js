import { useEffect, useState } from 'react';
import { getClubRankings } from '../api/rankingApi.js';

/**
 * 동아리 내 칭찬왕 랭킹을 가져오는 커스텀 훅
 * @param {string|number} clubId - 동아리 ID
 * @param {number} limit - 가져올 랭킹 개수 (기본값: 3)
 * @returns {object} { data, loading, error }
 * data 구조: [{ rank, id, name, profileImage, receivedCount }, ...]
 */
export default function useClubRankings(clubId, limit = 3) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!clubId) {
      setData(null);
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const result = await getClubRankings(clubId, limit);
        if (!cancelled) {
          setData(result);
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
  }, [clubId, limit]);

  return { data, loading, error };
}

