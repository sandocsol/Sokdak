import { apiClient, getApiUrl, USE_MOCK_DATA } from '../../../lib/apiClient.js';

/**
 * 대학교 목록을 가져오는 API 함수
 * @returns {Promise} 대학교 목록 데이터
 */
export const getUniversities = async () => {
  let endpoint;
  if (USE_MOCK_DATA) {
    // 목 데이터 경로: /data/universities.json
    endpoint = getApiUrl('/data/universities.json');
  } else {
    // TODO: 대학교 목록 조회 API 엔드포인트가 명세에 없으므로 목 데이터 사용
    endpoint = getApiUrl('/data/universities.json');
  }
  const response = await apiClient.get(endpoint);
  return response.data;
};

