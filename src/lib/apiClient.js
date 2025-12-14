import axios from 'axios';

// 목 데이터 사용 여부 (환경 변수로 제어)
export const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

// 인증 우회 설정 (로그인 없이 테스트 가능)
// .env 파일에 VITE_SKIP_AUTH=true 설정 시 401 에러 시 리다이렉트하지 않음
export const SKIP_AUTH = import.meta.env.VITE_SKIP_AUTH === 'true';

// 개발 환경에서는 로컬 API 서버, 프로덕션에서는 실제 API 서버
// 목 데이터 모드일 때는 baseURL을 빈 문자열로 설정 (상대 경로 사용)
const API_BASE_URL = USE_MOCK_DATA 
  ? '' 
  : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080');

/**
 * Axios 인스턴스 생성
 * 전역 설정 및 인터셉터를 추가할 수 있습니다.
 * 세션 기반 인증을 위해 withCredentials를 true로 설정하여 쿠키를 자동으로 전송합니다.
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // 쿠키(JSESSIONID) 자동 전송
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// 응답 인터셉터: 401 에러 시 자동 로그아웃 처리
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const currentPath = window.location.pathname;
    const publicPaths = ['/onboarding', '/login'];
    const isPublicPath = publicPaths.some(path => currentPath === path || currentPath.startsWith(path));
    
    if (status === 401) {
      // SKIP_AUTH가 true이면 리다이렉트하지 않음 (다른 기능 테스트 가능)
      if (!SKIP_AUTH) {
        // 인증이 필요 없는 페이지에서는 리다이렉트하지 않음
        if (!isPublicPath) {
          // 세션 만료 또는 인증 실패 시 처리
          // 로그인 페이지로 리다이렉트
          window.location.href = '/login';
        }
      } else {
        // 인증 우회 모드에서는 콘솔에만 경고 출력
        console.warn('401 Unauthorized - 인증이 필요합니다. (인증 우회 모드: 리다이렉트 비활성화)');
      }
    } else if (status >= 500 && isPublicPath) {
      // 회원가입/로그인 페이지에서 서버 에러는 조용히 처리 (콘솔에 출력하지 않음)
      // 에러는 reject하되, 콘솔에는 표시되지 않도록 함
    }
    
    return Promise.reject(error);
  }
);

/**
 * API 엔드포인트 상수 정의
 * 이미지에 명시된 API 명세를 기반으로 작성
 */
export const API_ENDPOINTS = {
  // 회원 관련
  MEMBERS: {
    REGISTER: '/api/members/register',
    LOGIN: '/api/members/login',
    LOGOUT: '/api/members/logout',
    ME: '/api/members/me',
    INFO: '/api/members',
    UPDATE: '/api/members',
    DELETE: '/api/members',
    CATEGORY_OPTIONS: (category) => `/api/members/categories/options?category=${category}`,
  },

  // 동아리 관련
  CLUBS: {
    CREATE: '/api/clubs',
    DELETE: (clubId) => `/api/clubs/${clubId}`,
    GET: (clubId) => `/api/clubs/${clubId}`,
    SEARCH: (query) => `/api/clubs/search?q=${encodeURIComponent(query)}`,
    JOIN: (clubId) => `/api/clubs/${clubId}/join`,
    MEMBERS: (clubId, active = null) => {
      const base = `/api/clubs/${clubId}/members`;
      return active !== null ? `${base}?active=${active}` : base;
    },
    APPROVE_MEMBER: (clubId, userId) => `/api/clubs/${clubId}/members/${userId}/approve`,
    REJECT_MEMBER: (clubId, userId) => `/api/clubs/${clubId}/members/${userId}/reject`,
  },

  // 칭찬 관련
  COMPLIMENTS: {
    GIVE: (clubId, userId) => `/api/compliments/clubs/${clubId}/users/${userId}`,
    SELECT: '/api/compliments/select',
    EMBEDDING: '/api/compliments/embedding',
    RECEIVE: '/api/compliments/receive',
    SEND: '/api/compliments/send',
  },

  // 랭킹 관련
  RANKING: {
    GET: '/api/ranking',
  },
};

/**
 * API URL 생성 헬퍼
 * @param {string} endpoint - API 엔드포인트 경로
 * @returns {string} 완전한 API URL
 */
export function getApiUrl(endpoint) {
  // endpoint가 이미 전체 URL인 경우
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    return endpoint;
  }
  
  // 상대 경로인 경우
  if (endpoint.startsWith('/')) {
    return API_BASE_URL ? `${API_BASE_URL}${endpoint}` : endpoint;
  }
  
  return `${API_BASE_URL}/${endpoint}`;
}

export default API_BASE_URL;

