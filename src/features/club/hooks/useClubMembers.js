import { useEffect, useMemo, useState } from 'react';

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

  const dataUrl = useMemo(() => {
    return '/data/club-members.json';
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
          throw new Error(`Failed to load club members: ${res.status}`);
        }

        const json = await res.json();
        
        // clubId로 특정 동아리의 멤버 정보 찾기
        const clubData = json.find((item) => 
          item.clubId.toString() === clubId.toString() || item.clubId === clubId
        );

        if (!cancelled) {
          if (clubData) {
            setData(clubData);
          } else {
            // 데이터가 없으면 빈 데이터 반환
            setData({
              memberCount: 0,
              rankings: [],
              members: []
            });
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

