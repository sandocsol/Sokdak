import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  align-items: center;
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
  }
`;

const RequestButton = styled(ActionButton)`
  background: #2ab7ca;
`;

const PraiseButton = styled(ActionButton)`
  background: ${(props) => (props.disabled ? "#b9d0d3" : "#2ab7ca")};
`;

/**
 * 동아리 가입 액션 버튼 컴포넌트
 * @param {object} club - 동아리 정보
 * @param {boolean} isMember - 멤버 여부 (칭찬하러 가기 버튼 활성화 여부)
 */
export default function ClubJoinActions({ club, isMember = false }) {
  const navigate = useNavigate();

  const handleRequestMembership = () => {
    // TODO: 멤버 요청 API 호출
    console.log("멤버 요청:", club);
    // 멤버 요청 후 처리 로직
  };

  const handleGoToPraise = () => {
    if (isMember) {
      // TODO: 해당 동아리의 칭찬 페이지로 이동
      navigate("/praise", { state: { clubId: club?.id } });
    }
  };

  return (
    <Container>
      <RequestButton onClick={handleRequestMembership}>
        멤버 요청하기
      </RequestButton>
      <PraiseButton disabled={!isMember} onClick={handleGoToPraise}>
        칭찬하러 가기
      </PraiseButton>
    </Container>
  );
}

