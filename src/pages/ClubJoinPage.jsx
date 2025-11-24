import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import useClub from "../features/club/hooks/useClub.js";
import ClubInfoCard from "../features/club/components/ClubInfoCard.jsx";
import ClubJoinActions from "../features/club/components/ClubJoinActions.jsx";

const Container = styled.div`
  width: 100%;
  height: 100%;
  background: #222222;
  position: relative;
  overflow: hidden;
`;

const BackButton = styled.button`
  position: absolute;
  left: 23px;
  top: 70px;
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
  top: 234px;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const ActionsContainer = styled.div`
  position: absolute;
  left: 50%;
  top: 700px;
  transform: translateX(-50%);
  width: 100%;
  max-width: 333px;
  padding: 0 20px;
  box-sizing: border-box;
`;

export default function ClubJoinPage() {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const { data: club, loading, error } = useClub(clubId);

  const handleBack = () => {
    navigate(-1);
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

  return (
    <Container>
      <BackButton onClick={handleBack}>
        <img src="/assets/Chevron_Left.svg" alt="뒤로 가기" />
      </BackButton>
      
      <ContentContainer>
        <ClubInfoCard club={club} />
      </ContentContainer>
      
      <ActionsContainer>
        <ClubJoinActions club={club} isMember={isMember} />
      </ActionsContainer>
    </Container>
  );
}

