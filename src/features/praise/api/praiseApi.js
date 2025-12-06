import { apiClient, API_ENDPOINTS, getApiUrl, USE_MOCK_DATA } from '../../../lib/apiClient.js';

/**
 * 칭찬 목록을 가져오는 API 함수
 * @param {string|number} clubId - 동아리 ID
 * @param {string|number} userId - 사용자 ID (보낸 사람 ID)
 * @returns {Promise} 칭찬 목록 데이터
 */
export const getPraiseCategories = async (clubId, userId) => {
  if (USE_MOCK_DATA) {
    // 목 데이터 경로: /data/praise-categories.json
    const endpoint = getApiUrl('/data/praise-categories.json');
    const response = await apiClient.get(endpoint);
    return response.data;
  } else {
    // POST /api/compliments/clubs/{club_id}/users/{user_id}를 사용하여 칭찬 목록 조회
    const endpoint = API_ENDPOINTS.COMPLIMENTS.GIVE(clubId, userId);
    const response = await apiClient.post(endpoint, {});
    return response.data;
  }
};

/**
 * 칭찬하기
 * @param {string|number} complimentId - 칭찬 ID
 * @param {string|number} userId - 칭찬받을 사용자 ID
 * @param {boolean} isAnonymous - 익명 여부 (기본값: true)
 * @returns {Promise}
 */
export const giveCompliment = async (complimentId, userId, isAnonymous = true) => {
  if (USE_MOCK_DATA) {
    throw new Error('Give compliment is not supported in mock data mode');
  }
  const response = await apiClient.post(API_ENDPOINTS.COMPLIMENTS.SELECT, {
    complimentId,
    userId,
    isAnonymous,
  });
  return response.data;
};

