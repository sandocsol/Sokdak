import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import ClubSelector from "../components/ClubSelector/ClubSelector.jsx";
import useClub from "../features/club/hooks/useClub.js";
import useClubs from "../features/club/hooks/useClubs.js";
import useClubMembers from "../features/club/hooks/useClubMembers.js";

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
  padding-left: 42px;
  padding-right: 42px;
  padding-bottom: 20px;
`;

const ClubInfoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 27px;
  margin-left: 42px;
`;

const MemberIcon = styled.div`
  width: 60px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const MemberCount = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0;
  position: relative;
`;

const CountNumber = styled.p`
  font-family: "Inter", sans-serif;
  font-weight: 400;
  font-size: 50px;
  line-height: 1;
  color: #9f9f9f;
  margin: 0;
  position: absolute;
  left: 31.5px;
  top: 0;
  transform: translateX(-50%);
`;

const CountUnit = styled.p`
  font-family: "Inter", "Noto Sans KR", sans-serif;
  font-weight: 400;
  font-size: 20px;
  line-height: 1;
  color: #9f9f9f;
  margin: 0;
  position: absolute;
  left: 79.5px;
  top: 30px;
  transform: translateX(-50%);
`;

const SectionTitle = styled.h2`
  font-family: "Inter", "Noto Sans KR", sans-serif;
  font-weight: 700;
  font-size: 20px;
  line-height: 1;
  color: #cfcfcf;
  margin: 0 0 20px 42px;
`;

const RankingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 9px;
  margin: 0 29px 40px 29px;
`;

const RankingItem = styled.div`
  width: 100%;
  height: 55px;
  border: 1px solid #585858;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 20px;
  box-sizing: border-box;
`;

const RankNumber = styled.p`
  font-family: "Inter", sans-serif;
  font-weight: 700;
  font-size: 20px;
  line-height: 1;
  margin: 0;
  min-width: 20px;
  text-align: center;
`;

const RankNumber1 = styled(RankNumber)`
  color: #fe4b4a;
`;

const RankNumber2 = styled(RankNumber)`
  color: #2ab7ca;
`;

const RankNumber3 = styled(RankNumber)`
  color: #fed766;
`;

const ProfileImage = styled.div`
  width: 31px;
  height: 31px;
  border-radius: 50%;
  background: #585858;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const MemberName = styled.p`
  font-family: "Inter", "Noto Sans KR", sans-serif;
  font-weight: 400;
  font-size: 20px;
  line-height: 1;
  color: white;
  margin: 0;
  flex: 1;
`;

const MemberList = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 30px;
`;

const MemberItem = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid #585858;
  box-sizing: border-box;
  
  &:last-child {
    border-bottom: none;
  }
`;

export default function ClubPage() {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const { data: clubs, loading: clubsLoading } = useClubs();
  const { data: club, loading: clubLoading, error: clubError } = useClub(clubId);
  const { data: membersData, loading: membersLoading, error: membersError } = useClubMembers(clubId);

  // clubId는 항상 있어야 함 (라우팅에서 보장)
  if (!clubId) {
    return null; // loader에서 리다이렉트되므로 여기 도달하지 않음
  }

  const currentClubId = clubId;

  const handleClubChange = (newClubId) => {
    navigate(`/club/${newClubId}`);
  };

  // 멤버 데이터 추출
  const topMembers = membersData?.rankings || [];
  const members = membersData?.members || [];
  const memberCount = membersData?.memberCount || 0;

  if (clubLoading || clubsLoading || membersLoading) {
    return (
      <Container>
        <Header>
          <p style={{ color: "#cfcfcf" }}>로딩 중...</p>
        </Header>
      </Container>
    );
  }

  if (clubError || !club) {
    return (
      <Container>
        <Header>
          <p style={{ color: "#cfcfcf" }}>동아리를 찾을 수 없습니다.</p>
        </Header>
      </Container>
    );
  }

  if (membersError) {
    return (
      <Container>
        <Header>
          <p style={{ color: "#cfcfcf" }}>멤버 정보를 불러올 수 없습니다.</p>
        </Header>
      </Container>
    );
  }

  const selectedClub = club;
  const allClubs = clubs || [];

  return (
    <Container>
      <Header>
        <ClubSelector
          university={selectedClub.university || ""}
          clubName={selectedClub.name}
          clubs={allClubs}
          selectedClubId={currentClubId}
          onClubChange={handleClubChange}
        />
      </Header>

      <ClubInfoSection>
        <MemberIcon>
          {/* TODO: 실제 멤버 아이콘 이미지 사용 */}
          <div style={{
            width: '60px',
            height: '56px',
            background: '#585858',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#9f9f9f',
            fontSize: '24px'
          }}>
            👥
          </div>
        </MemberIcon>
        <MemberCount>
          <CountNumber>{memberCount}</CountNumber>
          <CountUnit>명</CountUnit>
        </MemberCount>
      </ClubInfoSection>

      <SectionTitle>우리 동아리 칭찬왕</SectionTitle>
      <RankingList>
        {topMembers.map((member) => {
          const RankComponent = member.rank === 1 ? RankNumber1 : 
                                member.rank === 2 ? RankNumber2 : 
                                RankNumber3;
          return (
            <RankingItem key={member.id}>
              <RankComponent>{member.rank}</RankComponent>
              <ProfileImage>
                {member.profileImage ? (
                  <img src={member.profileImage} alt={member.name} />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    background: '#585858',
                    borderRadius: '50%'
                  }} />
                )}
              </ProfileImage>
              <MemberName>{member.name}</MemberName>
            </RankingItem>
          );
        })}
      </RankingList>

      <SectionTitle>우리 동아리 멤버</SectionTitle>
      <MemberList>
        {members.map((member) => (
          <MemberItem key={member.id}>
            <ProfileImage>
              {member.profileImage ? (
                <img src={member.profileImage} alt={member.name} />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: '#585858',
                  borderRadius: '50%'
                }} />
              )}
            </ProfileImage>
            <MemberName>{member.name}</MemberName>
          </MemberItem>
        ))}
      </MemberList>
    </Container>
  );
}
