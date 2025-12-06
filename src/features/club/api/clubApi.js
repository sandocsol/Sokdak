import { apiClient, API_ENDPOINTS, getApiUrl, USE_MOCK_DATA } from '../../../lib/apiClient.js';

/**
 * 특정 동아리 정보를 가져오는 API 함수
 * @param {string|number} clubId - 동아리 ID
 * @returns {Promise} 동아리 정보 데이터
 */
export const getClub = async (clubId) => {
  let endpoint;
  if (USE_MOCK_DATA) {
    // 목 데이터: club-details.json에서 찾기
    endpoint = getApiUrl('/data/club-details.json');
    const response = await apiClient.get(endpoint);
    const clubs = response.data;
    const club = clubs.find((c) => 
      c.clubId.toString() === clubId.toString() || c.clubId === clubId
    );
    if (!club) {
      throw new Error('Club not found');
    }
    return club;
  } else {
    // 실제 API 경로: /api/clubs/{clubId}
    endpoint = API_ENDPOINTS.CLUBS.GET(clubId);
    const response = await apiClient.get(endpoint);
    return response.data;
  }
};

/**
 * 동아리 멤버 정보를 가져오는 API 함수
 * @param {string|number} clubId - 동아리 ID
 * @returns {Promise} 동아리 멤버 정보 데이터
 */
export const getClubMembers = async (clubId) => {
  let endpoint;
  if (USE_MOCK_DATA) {
    // 목 데이터 경로: /data/club-members.json
    endpoint = getApiUrl('/data/club-members.json');
    const response = await apiClient.get(endpoint);
    const json = response.data;
    
    // clubId로 특정 동아리의 멤버 정보 찾기
    const clubData = json.find((item) => 
      item.clubId.toString() === clubId.toString() || item.clubId === clubId
    );

    if (clubData) {
      return clubData;
    } else {
      // 데이터가 없으면 빈 데이터 반환
      return {
        memberCount: 0,
        rankings: [],
        members: []
      };
    }
  } else {
    // 실제 API 경로: /api/clubs/{clubId}/members
    endpoint = API_ENDPOINTS.CLUBS.MEMBERS(clubId);
    const response = await apiClient.get(endpoint);
    return response.data;
  }
};

// ===== 백엔드 API 전용 함수들 (USE_MOCK_DATA가 false일 때만 사용) =====

/**
 * 동아리 생성
 * @param {object} clubData - 동아리 생성 데이터
 * @returns {Promise} 생성된 동아리 정보
 */
export const createClub = async (clubData) => {
  if (USE_MOCK_DATA) {
    throw new Error('Create is not supported in mock data mode');
  }
  const response = await apiClient.post(API_ENDPOINTS.CLUBS.CREATE, clubData);
  return response.data;
};

/**
 * 동아리 삭제
 * @param {string|number} clubId - 동아리 ID
 * @returns {Promise}
 */
export const deleteClub = async (clubId) => {
  if (USE_MOCK_DATA) {
    throw new Error('Delete is not supported in mock data mode');
  }
  const response = await apiClient.delete(API_ENDPOINTS.CLUBS.DELETE(clubId));
  return response.data;
};

/**
 * 동아리 검색
 * @param {string} query - 검색어
 * @returns {Promise} 검색 결과
 */
export const searchClubs = async (query) => {
  let endpoint;
  if (USE_MOCK_DATA) {
    // 목 데이터: 전체 목록에서 필터링
    endpoint = getApiUrl('/data/clubs.json');
    const response = await apiClient.get(endpoint);
    const clubs = response.data;
    const filtered = clubs.filter((club) => 
      club.name?.toLowerCase().includes(query.toLowerCase()) ||
      club.description?.toLowerCase().includes(query.toLowerCase())
    );
    return filtered;
  } else {
    // 실제 API 경로: /api/clubs/search?q={query}
    endpoint = API_ENDPOINTS.CLUBS.SEARCH(query);
    const response = await apiClient.get(endpoint);
    return response.data;
  }
};

/**
 * 동아리 가입신청
 * @param {string|number} clubId - 동아리 ID
 * @returns {Promise}
 */
export const joinClub = async (clubId) => {
  if (USE_MOCK_DATA) {
    throw new Error('Join is not supported in mock data mode');
  }
  const response = await apiClient.post(API_ENDPOINTS.CLUBS.JOIN(clubId));
  return response.data;
};

/**
 * 승인된 멤버 목록 조회
 * @param {string|number} clubId - 동아리 ID
 * @returns {Promise} 승인된 멤버 목록
 */
export const getApprovedMembers = async (clubId) => {
  let endpoint;
  if (USE_MOCK_DATA) {
    // 목 데이터: club-members-active.json에서 찾기
    endpoint = getApiUrl('/data/club-members-active.json');
    const response = await apiClient.get(endpoint);
    const membersList = response.data;
    const membersData = membersList.find((item) => 
      item.clubId.toString() === clubId.toString() || item.clubId === clubId
    );
    if (!membersData) {
      return {
        clubId: Number(clubId),
        active: true,
        count: 0,
        members: []
      };
    }
    return membersData;
  } else {
    // 실제 API 경로: /api/clubs/{clubId}/members?active=true
    endpoint = API_ENDPOINTS.CLUBS.MEMBERS(clubId, true);
    const response = await apiClient.get(endpoint);
    return response.data;
  }
};

/**
 * 승인 대기 중인 멤버 목록 조회
 * @param {string|number} clubId - 동아리 ID
 * @returns {Promise} 승인 대기 멤버 목록
 */
export const getPendingMembers = async (clubId) => {
  let endpoint;
  if (USE_MOCK_DATA) {
    // 목 데이터: club-members-pending.json에서 찾기
    endpoint = getApiUrl('/data/club-members-pending.json');
    const response = await apiClient.get(endpoint);
    const membersList = response.data;
    const membersData = membersList.find((item) => 
      item.clubId.toString() === clubId.toString() || item.clubId === clubId
    );
    if (!membersData) {
      return {
        clubId: Number(clubId),
        active: false,
        count: 0,
        members: []
      };
    }
    return membersData;
  } else {
    // 실제 API 경로: /api/clubs/{clubId}/members?active=false
    endpoint = API_ENDPOINTS.CLUBS.MEMBERS(clubId, false);
    const response = await apiClient.get(endpoint);
    return response.data;
  }
};

/**
 * 동아리 가입 승인
 * @param {string|number} clubId - 동아리 ID
 * @param {string|number} userId - 사용자 ID
 * @returns {Promise}
 */
export const approveMember = async (clubId, userId) => {
  if (USE_MOCK_DATA) {
    throw new Error('Approve is not supported in mock data mode');
  }
  const response = await apiClient.post(API_ENDPOINTS.CLUBS.APPROVE_MEMBER(clubId, userId));
  return response.data;
};

/**
 * 동아리 가입 거절
 * @param {string|number} clubId - 동아리 ID
 * @param {string|number} userId - 사용자 ID
 * @returns {Promise}
 */
export const rejectMember = async (clubId, userId) => {
  if (USE_MOCK_DATA) {
    throw new Error('Reject is not supported in mock data mode');
  }
  const response = await apiClient.post(API_ENDPOINTS.CLUBS.REJECT_MEMBER(clubId, userId));
  return response.data;
};

