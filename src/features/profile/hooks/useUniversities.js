import { useEffect, useState } from 'react';
import { getUniversities } from '../api/universityApi.js';

/**
 * 대학교 목록을 가져오는 커스텀 훅
 * @returns {object} { data, loading, error }
 */
export default function useUniversities() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const result = await getUniversities();
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) {
          setError(err);
          setData([]);
        }
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

