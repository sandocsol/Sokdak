import { useEffect, useMemo, useState } from 'react';

/**
 * 프로필 메시지(받은/보낸)를 가져오는 커스텀 훅
 * @param {string} type - 'received' 또는 'sent'
 * @returns {object} { data, loading, error }
 */
export default function useProfileMessages(type = 'received') {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dataUrl = useMemo(() => {
    if (type === 'sent') {
      return '/data/sent-messages.json';
    }
    return '/data/received-messages.json';
  }, [type]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!dataUrl) return;

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(dataUrl, { headers: { 'Accept': 'application/json' } });

        if (!res.ok) {
          throw new Error(`Failed to load ${type} messages: ${res.status}`);
        }

        const json = await res.json();

        if (!cancelled) setData(json);
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
  }, [dataUrl, type]);

  return { data, loading, error };
}

