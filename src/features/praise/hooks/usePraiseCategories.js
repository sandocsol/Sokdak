import { useEffect, useState } from 'react';
import { getPraiseCategories } from '../api/praiseApi.js';

/**
 * 칭찬 카테고리 목록을 가져오는 커스텀 훅
 * @param {string|number} clubId - 동아리 ID
 * @returns {object} { data, loading, error }
 */
export default function usePraiseCategories(clubId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!clubId) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await getPraiseCategories(clubId);
        if (!cancelled) setData(result);
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
  }, [clubId]);

  return { data, loading, error };
}

