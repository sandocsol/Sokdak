import { useEffect, useState } from 'react';
import { searchClubs } from '../api/clubApi.js';

/**
 * 동아리 검색을 위한 커스텀 훅
 * 검색어가 입력될 때마다 검색 API를 호출합니다.
 * @param {string} query - 검색어
 * @param {boolean} enabled - 검색 실행 여부 (기본값: true)
 * @returns {object} { data, loading, error }
 */
export default function useSearchClubs(query, enabled = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 검색어가 없거나 비활성화된 경우 검색하지 않음
    if (!enabled || !query || !query.trim()) {
      setData(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function search() {
      setLoading(true);
      setError(null);

      try {
        const result = await searchClubs(query.trim());
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    // 디바운싱: 검색어 입력 후 300ms 후에 검색 실행
    const timer = setTimeout(search, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, enabled]);

  return { data, loading, error };
}
