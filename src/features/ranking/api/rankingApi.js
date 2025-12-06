import { apiClient, API_ENDPOINTS, getApiUrl, USE_MOCK_DATA } from '../../../lib/apiClient.js';

/**
 * 랭킹 데이터를 가져오는 API 함수
 * @returns {Promise} 랭킹 데이터 (complimentKings, clubRankings 포함)
 */
export const getRankings = async () => {
  let endpoint;
  if (USE_MOCK_DATA) {
    // 목 데이터 경로: /data/rankings.json
    endpoint = getApiUrl('/data/rankings.json');
  } else {
    // 실제 API 경로: /api/ranking
    endpoint = API_ENDPOINTS.RANKING.GET;
  }
  const response = await apiClient.get(endpoint);
  return response.data;
};

