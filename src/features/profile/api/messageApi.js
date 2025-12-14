import { apiClient, getApiUrl, USE_MOCK_DATA, API_ENDPOINTS } from '../../../lib/apiClient.js';

/**
 * API 응답을 받은 메시지 형식으로 변환
 * @param {object} apiResponse - API 응답 객체
 * @returns {object} 변환된 받은 메시지 객체
 */
const transformReceivedMessage = (apiResponse) => {
  return {
    id: apiResponse.complimentId,
    senderName: apiResponse.anonymity || apiResponse.memberId === null ? '익명' : apiResponse.name,
    senderId: apiResponse.memberId,
    content: apiResponse.message,
    gender: apiResponse.gender,
    timestamp: apiResponse.createdAt,
    isAnonymous: apiResponse.anonymity || apiResponse.memberId === null,
  };
};

/**
 * API 응답을 보낸 메시지 형식으로 변환
 * @param {object} apiResponse - API 응답 객체
 * @returns {object} 변환된 보낸 메시지 객체
 */
const transformSentMessage = (apiResponse) => {
  return {
    id: apiResponse.complimentId,
    receiverName: apiResponse.name,
    receiverId: apiResponse.memberId,
    content: apiResponse.message,
    gender: apiResponse.gender,
    timestamp: apiResponse.createdAt,
    isAnonymous: apiResponse.anonymity || false,
  };
};

/**
 * 받은 메시지 목록을 가져오는 API 함수
 * @returns {Promise} 받은 메시지 목록 데이터
 */
export const getReceivedMessages = async () => {
  let endpoint;
  if (USE_MOCK_DATA) {
    // 목 데이터 경로: /data/received-messages.json
    endpoint = getApiUrl('/data/received-messages.json');
    const response = await apiClient.get(endpoint);
    return response.data;
  } else {
    // 실제 API 엔드포인트: /api/compliments/receive
    endpoint = API_ENDPOINTS.COMPLIMENTS.RECEIVE;
    const response = await apiClient.get(endpoint);
    // API 응답을 기존 형식으로 변환
    return response.data.map(transformReceivedMessage);
  }
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
    const response = await apiClient.get(endpoint);
    return response.data;
  } else {
    // 실제 API 엔드포인트: /api/compliments/send
    endpoint = API_ENDPOINTS.COMPLIMENTS.SEND;
    const response = await apiClient.get(endpoint);
    // API 응답을 기존 형식으로 변환
    return response.data.map(transformSentMessage);
  }
};

