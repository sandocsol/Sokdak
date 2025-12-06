import { useEffect, useState } from 'react';
import { getUserProfile } from '../api/userApi.js';

/**
 * 사용자 프로필을 가져오는 커스텀 훅
 * @returns {object} { data, loading, error }
 */
export default function useUserProfile() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const result = await getUserProfile();
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
  }, []);

  return { data, loading, error };
}

