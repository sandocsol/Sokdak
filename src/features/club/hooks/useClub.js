import { useEffect, useMemo, useState } from 'react';

/**
 * 단일 동아리 정보를 가져오는 커스텀 훅
 * @param {string|number} clubId - 동아리 ID
 * @returns {object} { data, loading, error }
 */
export default function useClub(clubId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dataUrl = useMemo(() => {
    return '/data/clubs.json';
  }, []);

  useEffect(() => {
    if (!clubId) {
      setData(null);
      return;
    }

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
        
        // clubId로 특정 동아리 찾기
        const club = json.find((c) => c.id.toString() === clubId.toString() || c.id === clubId);

        if (!cancelled) {
          if (club) {
            setData(club);
          } else {
            setError(new Error('Club not found'));
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [clubId, dataUrl]);

  return { data, loading, error };
}

