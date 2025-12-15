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
 * 전체 칭찬왕 랭킹을 가져오는 API 함수
 * @param {number} limit - 가져올 랭킹 개수 (기본값: 10)
 * @returns {Promise<Array>} 랭킹 데이터 배열 [{ rank, id, name, profileImage, sentCount }, ...]
 */
export const getGlobalSentRankings = async (limit = 10) => {
  let endpoint;
  if (USE_MOCK_DATA) {
    // 목 데이터 경로: /data/rankings.json
    endpoint = getApiUrl('/data/rankings.json');
    const response = await apiClient.get(endpoint);
    const data = response.data;
    // 목 데이터에서 complimentKings만 반환
    return data.complimentKings ? transformMemberData(data.complimentKings.slice(0, limit)) : [];
  } else {
    // 실제 API 경로: /api/rankings/global/sent?limit={limit}
    endpoint = API_ENDPOINTS.RANKING.GET_GLOBAL_SENT(limit);
    const response = await apiClient.get(endpoint);
    const data = response.data;
    
    // 백엔드 응답을 프론트엔드 형식으로 변환
    // 응답: [{ rank, userId, name, avatarUrl, sentCount }, ...]
    return transformMemberData(Array.isArray(data) ? data : []);
  }
};

/**
 * 동아리 전체 칭찬 보낸 랭킹을 가져오는 API 함수
 * @param {number} limit - 가져올 랭킹 개수 (기본값: 10)
 * @returns {Promise<Array>} 랭킹 데이터 배열 [{ rank, userId, name, avatarUrl, sentCount }, ...]
 * name은 동아리 이름이며, clubName으로 변환됨
 * rank는 배열 순서에 따라 1, 2, 3... 으로 할당됨 (API의 rank 필드는 무시)
 */
export const getClubsSentRankings = async (limit = 10) => {
  let endpoint;
  if (USE_MOCK_DATA) {
    // 목 데이터 경로: /data/rankings.json
    endpoint = getApiUrl('/data/rankings.json');
    const response = await apiClient.get(endpoint);
    const data = response.data;
    // 목 데이터에서 clubRankings만 반환하고 name을 clubName으로 변환
    // 배열 순서에 따라 rank를 할당 (1부터 시작)
    const clubRankings = (data.clubRankings || []).slice(0, limit).map((club, index) => ({
      ...club,
      clubName: club.clubName || club.name,
      rank: index + 1, // 배열 순서에 따라 rank 할당
    }));
    return clubRankings;
  } else {
    // 실제 API 경로: /api/rankings/clubs/sent?limit={limit}
    endpoint = API_ENDPOINTS.RANKING.GET_CLUBS_SENT(limit);
    const response = await apiClient.get(endpoint);
    const data = response.data;
    
    // 백엔드 응답을 프론트엔드 형식으로 변환
    // 응답: [{ rank, userId, name, avatarUrl, sentCount }, ...]
    // name을 clubName으로 변환
    // 배열 순서에 따라 rank를 할당 (1부터 시작, API의 rank 필드는 무시)
    return Array.isArray(data) ? data.map((item, index) => ({
      rank: index + 1, // 배열 순서에 따라 rank 할당
      userId: item.userId,
      clubName: item.name, // name을 clubName으로 변환
      avatarUrl: item.avatarUrl,
      sentCount: item.sentCount,
      receivedCount: item.receivedCount, // receivedCount가 있을 경우 포함
    })) : [];
  }
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

