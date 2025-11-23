/**
 * 시간 포맷 헬퍼 함수
 * @param {string} timestamp - ISO 8601 형식의 타임스탬프
 * @returns {string} 포맷된 시간 문자열
 */
export const formatTimeAgo = (timestamp) => {
  if (!timestamp) return "";
  
  const now = new Date();
  const time = new Date(timestamp);
  const diffInSeconds = Math.floor((now - time) / 1000);

  // 1분 미만: "방금 전"
  if (diffInSeconds < 60) {
    return "방금 전";
  }
  
  // 1시간 미만: 정확한 분 단위로 표시 (예: "5분 전", "30분 전", "59분 전")
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`;
  }
  
  // 24시간 미만: 정확한 시간 단위로 표시 (예: "1시간 전", "5시간 전", "23시간 전")
  const diffInHours = Math.floor(diffInSeconds / 3600);
  if (diffInHours < 24) {
    return `${diffInHours}시간 전`;
  }
  
  // 24시간 이상: 정확한 일 단위로 표시 (예: "1일 전", "3일 전", "30일 전")
  const diffInDays = Math.floor(diffInSeconds / 86400);
  return `${diffInDays}일 전`;
};

