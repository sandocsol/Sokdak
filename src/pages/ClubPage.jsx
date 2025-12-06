import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import ClubSelector from "../components/ClubSelector/ClubSelector.jsx";
import useClub from "../features/club/hooks/useClub.js";
import useClubMembers from "../features/club/hooks/useClubMembers.js";
import { useSelectedClub } from "../features/club/useSelectedClub.js";
import { useAuth } from "../features/auth/useAuth.js";

const Container = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: ${props => props.$needsScroll ? 'auto' : 'hidden'};
  overflow-x: hidden;
  position: relative;
  background: #222222;
  box-sizing: border-box;
  
  /* 스크롤바 숨기기 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;

const Header = styled.div`
  position: relative;
  padding-top: 90px; /* StatusBar 높이 */
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
  margin-bottom: 40px;
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
  height: 56px;
  min-width: 100px;
`;

const CountNumber = styled.p`
  font-family: "Inter", sans-serif;
  font-weight: 400;
  font-size: 50px;
  line-height: 1;
  color: #9f9f9f;
  margin-right: 5px;
`;

const CountUnit = styled.p`
  font-family: "Inter", "Noto Sans KR", sans-serif;
  font-weight: 400;
  font-size: 20px;
  line-height: 1;
  color: #9f9f9f;
  margin: 0;
  margin-left: 0;
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
  margin: 0 30px 80px 30px; /* BottomNav 높이만큼 하단 여백 */
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
  const { user: profileData, setSelectedClubId } = useAuth();
  const { userClubs, changeSelectedClub } = useSelectedClub();
  const { data: club, loading: clubLoading, error: clubError } = useClub(clubId);
  const { data: membersData, loading: membersLoading, error: membersError } = useClubMembers(clubId);
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const [needsScroll, setNeedsScroll] = useState(false);

  // URL의 clubId가 변경되면 사용자 정보도 업데이트
  useEffect(() => {
    if (clubId && clubId !== profileData?.selectedClubId) {
      setSelectedClubId(clubId);
    }
  }, [clubId, profileData?.selectedClubId, setSelectedClubId]);

  // 콘텐츠 높이 체크하여 스크롤 필요 여부 결정
  useEffect(() => {
    const checkScroll = () => {
      if (containerRef.current && contentRef.current) {
        const containerHeight = containerRef.current.clientHeight;
        const contentHeight = contentRef.current.scrollHeight;
        setNeedsScroll(contentHeight > containerHeight);
      }
    };

    checkScroll();
    // 리사이즈 이벤트 리스너 추가
    window.addEventListener('resize', checkScroll);
    // 데이터 로딩 후에도 체크
    const timer = setTimeout(checkScroll, 100);

    return () => {
      window.removeEventListener('resize', checkScroll);
      clearTimeout(timer);
    };
  }, [club, membersData, clubLoading, membersLoading]);

  // clubId는 항상 있어야 함 (라우팅에서 보장)
  if (!clubId) {
    return null; // loader에서 리다이렉트되므로 여기 도달하지 않음
  }

  const handleClubChange = (newClubId) => {
    changeSelectedClub(newClubId);
    navigate(`/club/${newClubId}`);
  };

  // 멤버 데이터 추출
  const topMembers = membersData?.rankings || [];
  const members = membersData?.members || [];
  const memberCount = membersData?.memberCount || 0;

  if (clubLoading || membersLoading) {
    return (
      <Container ref={containerRef} $needsScroll={false}>
        <div ref={contentRef}>
          <Header>
            <p style={{ color: "#cfcfcf" }}>로딩 중...</p>
          </Header>
        </div>
      </Container>
    );
  }

  if (clubError || !club) {
    return (
      <Container ref={containerRef} $needsScroll={false}>
        <div ref={contentRef}>
          <Header>
            <p style={{ color: "#cfcfcf" }}>동아리를 찾을 수 없습니다.</p>
          </Header>
        </div>
      </Container>
    );
  }

  if (membersError) {
    return (
      <Container ref={containerRef} $needsScroll={false}>
        <div ref={contentRef}>
          <Header>
            <p style={{ color: "#cfcfcf" }}>멤버 정보를 불러올 수 없습니다.</p>
          </Header>
        </div>
      </Container>
    );
  }

  return (
    <Container ref={containerRef} $needsScroll={needsScroll}>
      <div ref={contentRef}>
        <Header>
          <ClubSelector
            university={club.university || ""}
            clubName={club.name}
            clubs={userClubs}
            selectedClubId={clubId}
            onClubChange={handleClubChange}
          />
        </Header>

        <ClubInfoSection>
          <MemberIcon>
            <img src="/assets/Group.svg" alt="멤버 아이콘" />
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
      </div>
    </Container>
  );
}
