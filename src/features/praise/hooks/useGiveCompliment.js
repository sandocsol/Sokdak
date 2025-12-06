import { useState } from 'react';
import { giveCompliment } from '../api/praiseApi.js';

/**
 * 칭찬하기를 위한 커스텀 훅
 * @returns {object} { send: function, loading, error }
 */
export default function useGiveCompliment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const send = async (complimentId, userId, isAnonymous = true) => {
    setLoading(true);
    setError(null);

    try {
      const result = await giveCompliment(complimentId, userId, isAnonymous);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { send, loading, error };
}

