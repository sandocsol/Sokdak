import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import useClub from "../features/club/hooks/useClub.js";
import ClubInfoCard from "../features/club/components/ClubInfoCard.jsx";
import ClubJoinActions from "../features/club/components/ClubJoinActions.jsx";

const Container = styled.div`
  width: 100%;
  height: 100%;
  min-height: 844px;
  background: #222222;
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
`;

const BackButton = styled.button`
  position: absolute;
  left: 23px;
  top: calc(100vh * 70 / 844);
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  
  &:hover {
    opacity: 0.8;
  }
  
  &:active {
    opacity: 0.6;
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const ContentContainer = styled.div`
  position: absolute;
  left: 50%;
  top: calc(100vh * 234 / 844);
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  
  @media (max-height: 750px) {
    top: min(calc(100vh * 234 / 844), calc(100vh - 400px));
  }
  
  @media (max-height: 700px) {
    top: min(calc(100vh * 234 / 844), calc(100vh - 380px));
  }
`;

const ActionsContainer = styled.div`
  position: absolute;
  left: 50%;
  top: calc(100vh * 700 / 844);
  transform: translateX(-50%);
  width: 100%;
  max-width: 333px;
  padding: 0 20px;
  box-sizing: border-box;
  
  @media (max-height: 750px) {
    top: max(calc(100vh * 700 / 844), calc(100vh - 100px));
  }
  
  @media (max-height: 700px) {
    top: max(calc(100vh * 700 / 844), calc(100vh - 80px));
  }
`;

const MessageContainer = styled.div`
  position: absolute;
  left: 50%;
  top: calc(100vh * 700 / 844);
  transform: translateX(-50%) translateY(calc(-100% - 100vh * 30 / 844));
  width: fit-content;
  max-width: calc(100% - 40px);
  padding: 10px 12px;
  box-sizing: border-box;
  background: rgba(222, 251, 255, 0.8);
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  
  @media (max-height: 750px) {
    top: max(calc(100vh * 700 / 844), calc(100vh - 100px));
    transform: translateX(-50%) translateY(calc(-100% - min(100vh * 30 / 844, 25px)));
  }
  
  @media (max-height: 700px) {
    top: max(calc(100vh * 700 / 844), calc(100vh - 80px));
    transform: translateX(-50%) translateY(calc(-100% - min(100vh * 30 / 844, 20px)));
    padding: 8px 10px;
  }
`;

const MessageText = styled.div`
  text-align: center;
  color: #585858;
  font-size: 14px;
  font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-weight: 500;
  line-height: 18px;
  word-wrap: break-word;
  margin: 0;
  white-space: pre-line;
  
  @media (max-height: 700px) {
    font-size: 12px;
    line-height: 16px;
  }
`;

export default function ClubJoinPage() {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const { data: club, loading, error } = useClub(clubId);
  const [requestStatus, setRequestStatus] = useState(null);

  const handleBack = () => {
    navigate(-1);
  };

  const handleStatusChange = (status) => {
    setRequestStatus(status);
  };

  if (loading) {
    return (
      <Container>
        <BackButton onClick={handleBack}>
          <img src="/assets/Chevron_Left.svg" alt="뒤로 가기" />
        </BackButton>
        <ContentContainer>
          <p style={{ color: "#cfcfcf" }}>로딩 중...</p>
        </ContentContainer>
      </Container>
    );
  }

  if (error || !club) {
    return (
      <Container>
        <BackButton onClick={handleBack}>
          <img src="/assets/Chevron_Left.svg" alt="뒤로 가기" />
        </BackButton>
        <ContentContainer>
          <p style={{ color: "#cfcfcf" }}>
            {error ? "동아리를 찾을 수 없습니다." : "동아리 정보를 불러올 수 없습니다."}
          </p>
        </ContentContainer>
      </Container>
    );
  }

  // TODO: 실제 멤버 여부 확인 로직 (현재는 false로 설정)
  const isMember = false;
  const isPending = requestStatus === "PENDING";

  return (
    <Container>
      <BackButton onClick={handleBack}>
        <img src="/assets/Chevron_Left.svg" alt="뒤로 가기" />
      </BackButton>
      
      <ContentContainer>
        <ClubInfoCard club={club} />
      </ContentContainer>
      
      {isPending && (
        <MessageContainer>
          <MessageText>
            멤버 요청이 완료되었어요!<br />
            관리자가 요청을 수락하면<br />
            칭찬을 하러 갈 수 있어요.
          </MessageText>
        </MessageContainer>
      )}
      
      <ActionsContainer>
        <ClubJoinActions 
          club={club} 
          isMember={isMember} 
          onStatusChange={handleStatusChange}
        />
      </ActionsContainer>
    </Container>
  );
}

