import { useEffect, useState } from 'react';
import { getClubMembers } from '../api/clubApi.js';

/**
 * 동아리 멤버 정보를 가져오는 커스텀 훅
 * @param {string|number} clubId - 동아리 ID
 * @returns {object} { data, loading, error }
 * data 구조: { memberCount, rankings: [], members: [] }
 */
export default function useClubMembers(clubId) {
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
        const result = await getClubMembers(clubId);
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

