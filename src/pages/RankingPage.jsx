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
  justify-content: center;
  gap: 13px;
  padding: 0 0 20px 0;
  position: relative;
`;

const KingCard = styled.div`
  position: relative;
  width: 109px;
  height: ${(props) => {
    if (props.$rank === 1) return "189px";
    if (props.$rank === 2) return "189px";
    return "189px";
  }};
  border: 1px solid #585858;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 22px;
  background: transparent;
`;

const ProfileImage = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #585858;
  margin-bottom: 8px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
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
  margin-top: auto;
  padding-bottom: 20px;
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

const UniversityName = styled.span`
  font-family: "Inter", "Noto Sans KR", sans-serif;
  font-weight: 400;
  font-size: 15px;
  color: #8c8c8c;
  line-height: 1.2;
`;

export default function RankingPage() {
  const { data, loading, error } = useRankings();
  const complimentKings = data?.complimentKings || [];
  const clubRankings = data?.clubRankings || [];

  if (error) {
    console.error("Failed to load rankings:", error);
  }

  // 순서 조정: 1등은 중앙, 2등은 왼쪽, 3등은 오른쪽
  const orderedKings = [];
  if (complimentKings.length >= 3) {
    const king2 = complimentKings.find((k) => k.rank === 2); // 2등을 왼쪽에
    const king1 = complimentKings.find((k) => k.rank === 1); // 1등을 중앙에
    const king3 = complimentKings.find((k) => k.rank === 3); // 3등을 오른쪽에
    if (king2) orderedKings.push(king2);
    if (king1) orderedKings.push(king1);
    if (king3) orderedKings.push(king3);
  } else {
    orderedKings.push(...complimentKings);
  }

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
              <ProfileImage>
                {king.profileImage && (
                  <img src={king.profileImage} alt={king.name} />
                )}
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
          {clubRankings.map((club) => (
            <ClubRankingItem key={club.rank}>
              <ClubRankNumber $rank={club.rank}>{club.rank}</ClubRankNumber>
              <ClubInfo>
                <ClubName>{club.clubName}</ClubName>
                {club.university && (
                  <UniversityName>{club.university}</UniversityName>
                )}
              </ClubInfo>
            </ClubRankingItem>
          ))}
        </ClubRankingList>
      </Section>
    </Container>
  );
}
