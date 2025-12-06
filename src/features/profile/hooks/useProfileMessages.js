import { useEffect, useState } from 'react';
import { getReceivedMessages, getSentMessages } from '../api/messageApi.js';

/**
 * 프로필 메시지(받은/보낸)를 가져오는 커스텀 훅
 * @param {string} type - 'received' 또는 'sent'
 * @returns {object} { data, loading, error }
 */
export default function useProfileMessages(type = 'received') {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const result = type === 'sent' 
          ? await getSentMessages() 
          : await getReceivedMessages();
        
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
  }, [type]);

  return { data, loading, error };
}

