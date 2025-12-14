import { useEffect, useState } from 'react';
import { getAllBadges, getMyBadges } from '../api/badgesApi.js';
import { USE_MOCK_DATA } from '../../../lib/apiClient.js';

/**
 * 뱃지 목록을 가져오는 커스텀 훅
 * 모든 뱃지 목록을 가져오고, 사용자가 획득한 뱃지와 비교하여 isEarned 속성을 추가합니다.
 * @returns {object} { data, loading, error }
 */
export default function useBadges() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        // 모든 뱃지 목록과 내 뱃지 목록을 병렬로 가져옴
        const [allBadges, myBadgeCodes] = await Promise.all([
          getAllBadges(),
          getMyBadges(),
        ]);

        if (cancelled) return;

        // 목 데이터 모드에서는 기존 isEarned 필드를 사용
        // 실제 API 모드에서는 myBadgeCodes와 비교하여 isEarned 설정
        const processedBadges = allBadges.map((badge) => {
          if (USE_MOCK_DATA) {
            // 목 데이터 모드: 기존 isEarned 필드 사용
            return {
              ...badge,
              // iconUrl이 없으면 imageUrl 사용 (하위 호환성)
              iconUrl: badge.iconUrl || badge.imageUrl,
            };
          } else {
            // 실제 API 모드: myBadgeCodes와 비교
            const isEarned = myBadgeCodes.includes(badge.code);
            return {
              ...badge,
              isEarned,
              // iconUrl이 없으면 imageUrl 사용 (하위 호환성)
              iconUrl: badge.iconUrl || badge.imageUrl,
            };
          }
        });

        setData(processedBadges);
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

