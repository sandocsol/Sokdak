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
  const data = response.data;
  
  // 백엔드 응답을 프론트엔드 형식으로 변환
  return {
    ...data,
    complimentKings: data.complimentKings ? transformMemberData(data.complimentKings) : [],
    clubRankings: data.clubRankings || [],
  };
};

/**
 * 동아리 내 칭찬왕 랭킹을 가져오는 API 함수
 * @param {string|number} clubId - 동아리 ID
 * @param {number} limit - 가져올 랭킹 개수 (기본값: 3)
 * @returns {Promise<Array>} 랭킹 데이터 배열 [{ rank, id, name, profileImage, receivedCount }, ...]
 */
export const getClubRankings = async (clubId, limit = 3) => {
  let endpoint;
  if (USE_MOCK_DATA) {
    // 목 데이터 경로: /data/club-rankings.json
    endpoint = getApiUrl('/data/club-rankings.json');
    const response = await apiClient.get(endpoint);
    const json = response.data;
    
    // clubId로 특정 동아리의 랭킹 정보 찾기
    const clubRankings = json.find((item) => 
      item.clubId.toString() === clubId.toString() || item.clubId === clubId
    );

    if (clubRankings && clubRankings.rankings) {
      return transformMemberData(clubRankings.rankings.slice(0, limit));
    } else {
      return [];
    }
  } else {
    // 실제 API 경로: /api/rankings/clubs/{clubId}/sent?limit={limit}
    endpoint = API_ENDPOINTS.RANKING.GET_CLUB_SENT(clubId, limit);
    const response = await apiClient.get(endpoint);
    const data = response.data;
    
    // 백엔드 응답을 프론트엔드 형식으로 변환
    // 응답: [{ rank, userId, name, avatarUrl, receivedCount }, ...]
    return transformMemberData(Array.isArray(data) ? data : []);
  }
};

