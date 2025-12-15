import { apiClient, API_ENDPOINTS, getApiUrl, USE_MOCK_DATA } from '../../../lib/apiClient.js';

/**
 * 백엔드 멤버 데이터를 프론트엔드 형식으로 변환하는 헬퍼 함수
 * avatarUrl → profileImage, userId → id
 * @param {object|Array} memberOrMembers - 멤버 객체 또는 멤버 배열
 * @returns {object|Array} 변환된 멤버 객체 또는 멤버 배열
 */
const transformMemberData = (memberOrMembers) => {
  if (Array.isArray(memberOrMembers)) {
    return memberOrMembers.map(member => {
      const { userId, avatarUrl, ...rest } = member;
      return {
        ...rest,
        id: userId !== undefined ? userId : member.id,
        profileImage: avatarUrl !== undefined ? avatarUrl : member.profileImage,
      };
    });
  } else if (memberOrMembers && typeof memberOrMembers === 'object') {
    const { userId, avatarUrl, ...rest } = memberOrMembers;
    return {
      ...rest,
      id: userId !== undefined ? userId : memberOrMembers.id,
      profileImage: avatarUrl !== undefined ? avatarUrl : memberOrMembers.profileImage,
    };
  }
  return memberOrMembers;
};

/**
 * 특정 동아리 정보를 가져오는 API 함수
 * @param {string|number} clubId - 동아리 ID
 * @returns {Promise<{clubId: number, name: string, description: string, activeMemberCount: number, activeMembers: Array, createdAt: string, updatedAt: string}>} 동아리 정보 데이터
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
 * @param {boolean} active - 활성 멤버만 조회할지 여부 (기본값: true)
 * @returns {Promise} 동아리 멤버 정보 데이터
 */
export const getClubMembers = async (clubId, active = true) => {
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
    // 실제 API 경로: /api/clubs/{clubId}/members?active={active}
    endpoint = API_ENDPOINTS.CLUBS.MEMBERS(clubId, active);
    const response = await apiClient.get(endpoint);
    const data = response.data;
    
    // 백엔드 응답을 프론트엔드 형식으로 변환
    return {
      ...data,
      // activeMemberCount가 있으면 memberCount로 변환
      memberCount: data.memberCount !== undefined ? data.memberCount : (data.activeMemberCount !== undefined ? data.activeMemberCount : 0),
      rankings: data.rankings ? transformMemberData(data.rankings) : [],
      members: data.members ? transformMemberData(data.members) : [],
    };
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
 * @returns {Promise<Array<{id: number, name: string, description: string}>>} 검색 결과
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
      // || club.university?.toLowerCase().includes(query.toLowerCase())
    );
    return filtered;
  } else {
    // 실제 API 경로: /api/clubs/search?q={query}
    endpoint = API_ENDPOINTS.CLUBS.SEARCH(query);
    const response = await apiClient.get(endpoint);
    // 백엔드 응답이 clubId를 사용할 수 있으므로 id 필드로 변환
    const clubs = Array.isArray(response.data) ? response.data : [];
    return clubs.map((club) => ({
      ...club,
      id: club.id !== undefined ? club.id : club.clubId,
    }));
  }
};

/**
 * 동아리 가입신청
 * @param {string|number} clubId - 동아리 ID
 * @returns {Promise<{clubId: number, userId: number, requestStatus: string}>}
 */
export const joinClub = async (clubId) => {
  if (USE_MOCK_DATA) {
    // 목데이터: user-profile.json에서 현재 사용자 ID 가져오기
    let userId = 1; // 기본값
    try {
      const profileEndpoint = getApiUrl('/data/user-profile.json');
      const profileResponse = await apiClient.get(profileEndpoint);
      userId = profileResponse.data?.id || 1;
    } catch (err) {
      console.warn('Failed to load user profile for mock data, using default userId:', err);
    }

    // 목데이터 응답: API 스펙에 맞춰 PENDING 상태 반환
    // 실제 API 호출을 시뮬레이션하기 위해 약간의 지연 추가
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      clubId: Number(clubId),
      userId: userId,
      requestStatus: 'PENDING'
    };
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
    const data = response.data;
    
    // 백엔드 응답을 프론트엔드 형식으로 변환
    return {
      ...data,
      members: data.members ? transformMemberData(data.members) : [],
    };
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
    const data = response.data;
    
    // 백엔드 응답을 프론트엔드 형식으로 변환
    return {
      ...data,
      members: data.members ? transformMemberData(data.members) : [],
    };
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

