import { apiClient, getApiUrl, USE_MOCK_DATA } from '../../../lib/apiClient.js';

/**
 * 받은 메시지 목록을 가져오는 API 함수
 * @returns {Promise} 받은 메시지 목록 데이터
 */
export const getReceivedMessages = async () => {
  let endpoint;
  if (USE_MOCK_DATA) {
    // 목 데이터 경로: /data/received-messages.json
    endpoint = getApiUrl('/data/received-messages.json');
  } else {
    // TODO: 메시지 조회 API 엔드포인트가 명세에 없으므로 목 데이터 사용
    endpoint = getApiUrl('/data/received-messages.json');
  }
  const response = await apiClient.get(endpoint);
  return response.data;
};

/**
 * 보낸 메시지 목록을 가져오는 API 함수
 * @returns {Promise} 보낸 메시지 목록 데이터
 */
export const getSentMessages = async () => {
  let endpoint;
  if (USE_MOCK_DATA) {
    // 목 데이터 경로: /data/sent-messages.json
    endpoint = getApiUrl('/data/sent-messages.json');
  } else {
    // TODO: 메시지 조회 API 엔드포인트가 명세에 없으므로 목 데이터 사용
    endpoint = getApiUrl('/data/sent-messages.json');
  }
  const response = await apiClient.get(endpoint);
  return response.data;
};

