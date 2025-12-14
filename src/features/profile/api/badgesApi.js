import { apiClient, getApiUrl, USE_MOCK_DATA, API_ENDPOINTS } from '../../../lib/apiClient.js';

/**
 * 모든 뱃지 목록을 가져오는 API 함수
 * @returns {Promise<Array>} 뱃지 목록 데이터 (id, code, name, description, iconUrl 포함)
 */
export const getAllBadges = async () => {
  let endpoint;
  if (USE_MOCK_DATA) {
    // 목 데이터 경로: /data/badges.json
    endpoint = getApiUrl('/data/badges.json');
  } else {
    endpoint = API_ENDPOINTS.BADGES.GET_ALL;
  }
  const response = await apiClient.get(endpoint);
  return response.data;
};

/**
 * 사용자가 획득한 뱃지 코드 목록을 가져오는 API 함수
 * @returns {Promise<Array<string>>} 뱃지 코드 배열 (예: ["FIRST_COMPLIMENT", "TOP_SENDER_10"])
 */
export const getMyBadges = async () => {
  let endpoint;
  if (USE_MOCK_DATA) {
    // 목 데이터 모드에서는 빈 배열 반환 (또는 목 데이터에서 isEarned가 true인 것만 필터링)
    // 실제로는 getAllBadges에서 isEarned 필드를 확인하지만, API 연동 시에는 별도로 처리
    return [];
  } else {
    endpoint = API_ENDPOINTS.BADGES.GET_MINE;
  }
  const response = await apiClient.get(endpoint);
  return response.data;
};

