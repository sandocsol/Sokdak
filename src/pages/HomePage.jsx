import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import ClubSelector from "../components/ClubSelector/ClubSelector.jsx";
import { useSelectedClub } from "../features/club/useSelectedClub.js";

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding-bottom: 80px; /* BottomNav 높이만큼 여백 */
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  background: #222222;
  
  /* 스크롤바 숨기기 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;

const Header = styled.div`
  position: relative;
  padding-top: 61px; /* StatusBar 높이 */
  padding-left: 35px;
  padding-right: 35px;
  padding-bottom: 20px;
`;

const PraiseButton = styled.button`
  position: fixed;
  left: 50%;
  bottom: 120px; /* BottomNav 위에 배치 */
  transform: translateX(-50%);
  width: 330px;
  height: 50px;
  background: white;
  border: none;
  border-radius: 10px;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  padding: 11px 77px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  
  font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-weight: 600; /* SemiBold */
  font-size: 16px;
  line-height: 18px;
  color: #222222;
  text-align: center;
  white-space: nowrap;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:active {
    opacity: 0.8;
    outline: none;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  }
  
  &:focus-visible {
    outline: none;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  }
`;

export default function HomePage() {
  const navigate = useNavigate();
  const { selectedClub, userClubs, loading, changeSelectedClub } = useSelectedClub();

  const handlePraiseClick = () => {
    navigate("/praise");
  };

  const handleClubChange = (clubId) => {
    changeSelectedClub(clubId);
  };

  // 로딩 중이거나 동아리가 없을 때
  if (loading) {
    return (
      <Container>
        <Header>
          <p style={{ color: "#cfcfcf" }}>로딩 중...</p>
        </Header>
      </Container>
    );
  }

  if (!selectedClub || userClubs.length === 0) {
    return (
      <Container>
        <Header>
          <p style={{ color: "#cfcfcf" }}>가입한 동아리가 없습니다.</p>
        </Header>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <ClubSelector
          university={selectedClub.university || ""}
          clubName={selectedClub.name}
          clubs={userClubs}
          selectedClubId={selectedClub.id}
          onClubChange={handleClubChange}
        />
      </Header>
      <PraiseButton onClick={handlePraiseClick}>
        칭찬하러 가기
      </PraiseButton>
    </Container>
  );
}

