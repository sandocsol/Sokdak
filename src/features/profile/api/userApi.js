import { apiClient, API_ENDPOINTS, getApiUrl, USE_MOCK_DATA } from '../../../lib/apiClient.js';

/**
 * 사용자 프로필 관련 API 함수들
 * 
 * USE_MOCK_DATA가 true이면 목 데이터를, false이면 실제 백엔드 API를 사용합니다.
 * apiClient는 자동으로 토큰을 추가하고 401 에러를 처리합니다.
 */

/**
 * 내 정보 조회
 * @returns {Promise} 사용자 프로필 데이터
 */
export const getUserProfile = async () => {
  let endpoint;
  if (USE_MOCK_DATA) {
    // 목 데이터 경로: /data/user-profile.json
    endpoint = getApiUrl('/data/user-profile.json');
  } else {
    // 실제 API 경로: /api/members/me
    endpoint = API_ENDPOINTS.MEMBERS.ME;
  }
  const response = await apiClient.get(endpoint);
  return response.data;
};

/**
 * 회원 정보 조회
 * @returns {Promise} 회원 정보 데이터
 */
export const getMemberInfo = async () => {
  let endpoint;
  if (USE_MOCK_DATA) {
    // 목 데이터 경로: /data/user-profile.json
    endpoint = getApiUrl('/data/user-profile.json');
  } else {
    // 실제 API 경로: /api/members
    endpoint = API_ENDPOINTS.MEMBERS.INFO;
  }
  const response = await apiClient.get(endpoint);
  return response.data;
};

/**
 * 회원 정보 수정
 * @param {object} userData - 업데이트할 사용자 데이터
 * @returns {Promise} 업데이트된 회원 정보 데이터
 */
export const updateUserProfile = async (userData) => {
  if (USE_MOCK_DATA) {
    // 목 데이터 모드에서는 업데이트 불가
    throw new Error('Update is not supported in mock data mode');
  }
  const response = await apiClient.patch(API_ENDPOINTS.MEMBERS.UPDATE, userData);
  return response.data;
};

/**
 * 회원 탈퇴
 * @returns {Promise}
 */
export const deleteUserProfile = async () => {
  if (USE_MOCK_DATA) {
    // 목 데이터 모드에서는 삭제 불가
    throw new Error('Delete is not supported in mock data mode');
  }
  const response = await apiClient.delete(API_ENDPOINTS.MEMBERS.DELETE);
  return response.data;
};

