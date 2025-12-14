import { apiClient, API_ENDPOINTS } from '../../../lib/apiClient.js';

/**
 * 로그인 API
 * @param {object} credentials - 로그인 정보 { email, password }
 * @returns {Promise<object>} 로그인 성공 시 memberdto 반환 (id, email, name, nickname, avatarUrl, status, clubs)
 */
export const login = async (credentials) => {
  const response = await apiClient.post(API_ENDPOINTS.MEMBERS.LOGIN, credentials);
  return response.data;
};

/**
 * 회원가입 API
 * @param {object} registerData - 회원가입 정보 { email, password, name, nickname, avatarUrl, gender, selections }
 * @returns {Promise} 회원가입 성공 시 응답 데이터
 */
export const register = async (registerData) => {
  // 디버깅: API 요청 데이터 로그
  console.log('[register API] 요청 데이터:', registerData);
  console.log('[register API] gender 필드:', registerData.gender);
  
  const response = await apiClient.post(API_ENDPOINTS.MEMBERS.REGISTER, registerData);
  
  // 디버깅: API 응답 데이터 로그
  console.log('[register API] 응답 데이터:', response.data);
  
  return response.data;
};

/**
 * 로그아웃 API
 * @returns {Promise} 로그아웃 응답 데이터
 */
export const logout = async () => {
  // 세션 무효화를 위한 로그아웃 엔드포인트가 있다면 호출
  // 없으면 서버에서 세션을 자동으로 만료시키므로 생략 가능
  try {
    const response = await apiClient.post(API_ENDPOINTS.MEMBERS.LOGOUT);
    return response.data;
  } catch (error) {
    // 로그아웃 엔드포인트가 없어도 에러로 처리하지 않음
    return { success: true };
  }
};

