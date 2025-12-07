import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { joinClub } from "../api/clubApi.js";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const ActionButton = styled.button`
  height: 50px;
  border: none;
  border-radius: 10px;
  padding: 11px 77px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  
  font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 18px;
  color: white;
  text-align: center;
  white-space: nowrap;
  flex: 1;
  min-width: 160px;
  
  &:hover {
    opacity: ${(props) => (props.disabled ? 1 : 0.9)};
  }
  
  &:active {
    opacity: ${(props) => (props.disabled ? 1 : 0.8)};
    outline: none;
    box-shadow: none;
  }
  
  &:focus {
    outline: none;
    box-shadow: none;
  }
  
  &:focus-visible {
    outline: none;
    box-shadow: none;
  }
`;

const RequestButton = styled(ActionButton)`
  background: ${(props) => {
    if (props.$isPending) return "#b9d0d3";
    if (props.disabled) return "#b9d0d3";
    return "#2ab7ca";
  }};
`;

const PraiseButton = styled(ActionButton)`
  background: ${(props) => (props.disabled ? "#b9d0d3" : "#2ab7ca")};
`;

/**
 * 동아리 가입 액션 버튼 컴포넌트
 * @param {object} club - 동아리 정보
 * @param {boolean} isMember - 멤버 여부 (칭찬하러 가기 버튼 활성화 여부)
 * @param {function} onStatusChange - requestStatus가 변경될 때 호출되는 콜백 함수
 */
export default function ClubJoinActions({ club, isMember = false, onStatusChange }) {
  const navigate = useNavigate();
  const [requestStatus, setRequestStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestMembership = async () => {
    if (!club || !club.clubId) {
      console.error("동아리 정보가 없습니다.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await joinClub(club.clubId);
      
      // 응답에서 requestStatus 확인
      if (response?.requestStatus === "PENDING") {
        setRequestStatus("PENDING");
        // 부모 컴포넌트에 상태 변경 알림
        if (onStatusChange) {
          onStatusChange("PENDING");
        }
      }
    } catch (err) {
      console.error("멤버 요청 실패:", err);
      // TODO: 에러 메시지를 사용자에게 표시하는 UI 추가
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToPraise = () => {
    if (isMember) {
      navigate("/praise");
    }
  };

  const isPending = requestStatus === "PENDING";

  return (
    <Container>
      <RequestButton 
        onClick={handleRequestMembership}
        disabled={isPending || isLoading}
        $isPending={isPending}
      >
        {isLoading ? "요청 중..." : isPending ? "승인 대기 중" : "멤버 요청하기"}
      </RequestButton>
      <PraiseButton disabled={!isMember} onClick={handleGoToPraise}>
        칭찬하러 가기
      </PraiseButton>
    </Container>
  );
}

