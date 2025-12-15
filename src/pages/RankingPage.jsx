import styled from "styled-components";
import useRankings from "../features/ranking/hooks/useRankings.js";


const Container = styled.div`
  width: 100%;
  height: 100%;
  background: #222222;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  
  /* 스크롤바 숨기기 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;

const Section = styled.section`
  padding: 0 20px;
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-family: "Inter", "Noto Sans KR", sans-serif;
  font-weight: bold;
  font-size: 20px;
  line-height: normal;
  color: #cfcfcf;
  margin: 0;
  margin-bottom: 20px;
  padding-top: 90px; /* 첫 번째 섹션은 90px, 두 번째는 20px */
`;

const ComplimentKingsContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  gap: 13px;
  padding: 0 0 20px 0;
  position: relative;
  overflow-x: auto;
  overflow-y: hidden;
  flex-wrap: nowrap;
  
  /* 스크롤바 숨기기 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;

const KingCard = styled.div`
  position: relative;
  width: 100px;
  min-width: 100px;
  flex-shrink: 0;
  height: ${(props) => {
    if (props.$rank === 1) return "140px";
    if (props.$rank === 2) return "140px";
    return "140px";
  }};
  border: 1px solid #585858;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 16px;
  padding-bottom: 16px;
  background: transparent;
`;

const ProfileImage = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #585858;
  margin-bottom: 15px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: ${props => props.$isPlaceholder ? '70%' : '100%'};
    height: ${props => props.$isPlaceholder ? '70%' : '100%'};
    object-fit: cover;
  }
`;

const RankNumber = styled.span`
  font-family: "Inter", sans-serif;
  font-weight: bold;
  font-size: 20px;
  color: ${(props) => {
    if (props.$rank === 1) return "#fe4b4a";
    if (props.$rank === 2) return "#2ab7ca";
    if (props.$rank === 3) return "#fed766";
    return "#9f9f9f";
  }};
  margin-right: 8px;
`;

const KingName = styled.span`
  font-family: "Inter", "Noto Sans KR", sans-serif;
  font-weight: 500;
  font-size: 16px;
  color: #ffffff;
`;

const KingInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
`;

const ClubRankingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const ClubRankingItem = styled.div`
  width: 100%;
  height: 55px;
  border: 1px solid #585858;
  border-radius: 20px;
  display: flex;
  align-items: center;
  padding: 0 29px;
  margin-bottom: 8px;
  box-sizing: border-box;
`;

const ClubRankNumber = styled.span`
  font-family: "Inter", sans-serif;
  font-weight: bold;
  font-size: 20px;
  color: ${(props) => {
    if (props.$rank === 1) return "#fe4b4a";
    if (props.$rank === 2) return "#2ab7ca";
    if (props.$rank === 3) return "#fed766";
    return "#9f9f9f";
  }};
  margin-right: 15px;
  min-width: 20px;
`;

const ClubInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  flex: 1;
`;

const ClubName = styled.span`
  font-family: "Inter", "Noto Sans KR", sans-serif;
  font-weight: 400;
  font-size: 20px;
  color: #ffffff;
  line-height: 1.2;
`;

// const UniversityName = styled.span`
//   font-family: "Inter", "Noto Sans KR", sans-serif;
//   font-weight: 400;
//   font-size: 15px;
//   color: #8c8c8c;
//   line-height: 1.2;
// `;

export default function RankingPage() {
  const { data, loading, error } = useRankings();
  const complimentKings = data?.complimentKings || [];
  const clubRankings = data?.clubRankings || [];

  if (error) {
    console.error("Failed to load rankings:", error);
  }

  // 1등부터 순서대로 정렬
  const orderedKings = [...complimentKings].sort((a, b) => a.rank - b.rank);
  
  // 동아리 랭킹은 배열 순서에 따라 rank를 할당 (API의 rank 필드는 무시)
  const clubRankingsWithOrderedRank = clubRankings.map((club, index) => ({
    ...club,
    rank: index + 1, // 배열 순서에 따라 rank 할당
  }));

  if (loading) {
    return (
      <Container>
        <Section>
          <SectionTitle>전체 칭찬왕</SectionTitle>
          <p style={{ color: "#cfcfcf" }}>로딩 중...</p>
        </Section>
      </Container>
    );
  }

  return (
    <Container>
      <Section>
        <SectionTitle >전체 칭찬왕</SectionTitle>
        <ComplimentKingsContainer>
          {orderedKings.map((king) => (
            <KingCard key={king.rank} $rank={king.rank}>
              <ProfileImage $isPlaceholder={!king.profileImage || king.profileImage.includes('profile.svg')}>
                <img src={king.profileImage || '/assets/profile.svg'} alt={king.name} />
              </ProfileImage>
              <KingInfo>
                <RankNumber $rank={king.rank}>{king.rank}</RankNumber>
                <KingName>{king.name}</KingName>
              </KingInfo>
            </KingCard>
          ))}
        </ComplimentKingsContainer>
      </Section>

      <Section>
        <SectionTitle style={{ paddingTop: "20px" }}>동아리 랭킹</SectionTitle>
        <ClubRankingList>
          {clubRankingsWithOrderedRank.map((club) => (
            <ClubRankingItem key={club.rank}>
              <ClubRankNumber $rank={club.rank}>{club.rank}</ClubRankNumber>
              <ClubInfo>
                <ClubName>{club.clubName}</ClubName>
                {/* {club.university && (
                  <UniversityName>{club.university}</UniversityName>
                )} */}
              </ClubInfo>
            </ClubRankingItem>
          ))}
        </ClubRankingList>
      </Section>
    </Container>
  );
}
