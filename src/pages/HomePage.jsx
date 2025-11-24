import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import ClubSelector from "../components/ClubSelector/ClubSelector.jsx";
import { useAuth } from "../features/auth/useAuth.js";

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding-bottom: 80px; /* BottomNav 높이만큼 여백 */
  overflow-y: auto;
  position: relative;
  background: #222222;
`;

const Header = styled.div`
  position: relative;
  padding-top: 61px; /* StatusBar 높이 */
  padding-left: 35px;
  padding-right: 35px;
  padding-bottom: 20px;
`;

const PraiseButton = styled.button`
  position: absolute;
  left: 50%;
  top: 583px;
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
  
  font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-weight: 600; /* SemiBold */
  font-size: 16px;
  line-height: 18px;
  color: #222222;
  text-align: center;
  white-space: nowrap;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:active {
    opacity: 0.8;
  }
`;

export default function HomePage() {
  const navigate = useNavigate();
  const { user: profileData, loading: authLoading } = useAuth();
  const [selectedClubId, setSelectedClubId] = useState(null);

  // user-profile.json에서 사용자가 가입한 동아리 목록 가져오기
  const clubs = useMemo(() => {
    return profileData?.clubs?.map((club) => ({
      id: club.id.toString(),
      name: club.name,
      university: profileData.university || "",
    })) || [];
  }, [profileData]);

  // 초기 선택된 동아리 설정 (첫 번째 동아리)
  useEffect(() => {
    if (!selectedClubId && clubs.length > 0) {
      setSelectedClubId(clubs[0].id);
    }
  }, [clubs, selectedClubId]);

  // 선택된 동아리 정보
  const selectedClub = clubs.find((club) => club.id === selectedClubId) || clubs[0];

  const handlePraiseClick = () => {
    navigate("/praise");
  };

  const handleClubChange = (clubId) => {
    setSelectedClubId(clubId);
  };

  // 로딩 중이거나 동아리가 없을 때
  if (authLoading) {
    return (
      <Container>
        <Header>
          <p style={{ color: "#cfcfcf" }}>로딩 중...</p>
        </Header>
      </Container>
    );
  }

  if (!selectedClub || clubs.length === 0) {
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
          university={selectedClub.university || profileData?.university || ""}
          clubName={selectedClub.name}
          clubs={clubs}
          selectedClubId={selectedClubId}
          onClubChange={handleClubChange}
        />
      </Header>
      <PraiseButton onClick={handlePraiseClick}>
        칭찬하러 가기
      </PraiseButton>
    </Container>
  );
}

