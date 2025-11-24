import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0;
`;

const ClubIcon = styled.div`
  width: 132px;
  height: 132px;
  border-radius: 50%;
  background: #585858;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 27px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
`;

const ClubName = styled.h1`
  font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-weight: 600;
  font-size: 24px;
  line-height: 26px;
  color: #cfcfcf;
  margin: 0 0 2px 0;
  text-align: center;
`;

const Subtitle = styled.p`
  font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-weight: 600;
  font-size: 24px;
  line-height: 26px;
  color: #cfcfcf;
  margin: 0;
  text-align: center;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 27px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const IconWrapper = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  svg {
    width: 100%;
    height: 100%;
  }
`;

const InfoText = styled.p`
  font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-weight: 500;
  font-size: 16px;
  line-height: 18px;
  color: #585858;
  margin: 0;
`;

// Location Pin Icon
const LocationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10 2C7.24 2 5 4.24 5 7C5 11.5 10 18 10 18C10 18 15 11.5 15 7C15 4.24 12.76 2 10 2ZM10 9.5C8.62 9.5 7.5 8.38 7.5 7C7.5 5.62 8.62 4.5 10 4.5C11.38 4.5 12.5 5.62 12.5 7C12.5 8.38 11.38 9.5 10 9.5Z"
      fill="#585858"
    />
    <circle cx="10" cy="7" r="2.5" fill="#585858" />
  </svg>
);

// Members Icon (두 사람 아이콘)
const MembersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M7 7C8.38 7 9.5 5.88 9.5 4.5C9.5 3.12 8.38 2 7 2C5.62 2 4.5 3.12 4.5 4.5C4.5 5.88 5.62 7 7 7ZM13 7C14.38 7 15.5 5.88 15.5 4.5C15.5 3.12 14.38 2 13 2C11.62 2 10.5 3.12 10.5 4.5C10.5 5.88 11.62 7 13 7ZM7 8.5C4.88 8.5 0 9.62 0 11.75V13.5H14V11.75C14 9.62 9.12 8.5 7 8.5ZM14 8.5C13.67 8.5 13.35 8.52 13.04 8.55C13.73 9.18 14.25 9.98 14.5 10.9C15.23 11.18 16 11.75 16 13.75V15.5H20V11.75C20 9.62 16.12 8.5 14 8.5Z"
      fill="#585858"
    />
  </svg>
);

/**
 * 동아리 정보 카드 컴포넌트
 * @param {object} club - 동아리 정보 { id, name, university, ... }
 */
export default function ClubInfoCard({ club }) {
  if (!club) return null;

  return (
    <Container>
      <ClubIcon>
        {/* TODO: 실제 동아리 아이콘/이미지가 있으면 사용 */}
        <div style={{ 
          width: '100%', 
          height: '100%', 
          background: '#585858', 
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#9f9f9f',
          fontSize: '48px'
        }}>
          {club.name.charAt(0)}
        </div>
      </ClubIcon>
      
      <ClubName>{club.name}</ClubName>
      <Subtitle>동아리원을 칭찬해주세요</Subtitle>
      
      <InfoContainer>
        <InfoRow>
          <IconWrapper>
            <LocationIcon />
          </IconWrapper>
          <InfoText>{club.university}</InfoText>
        </InfoRow>
        
        <InfoRow>
          <IconWrapper>
            <MembersIcon />
          </IconWrapper>
          <InfoText>{club.name}</InfoText>
        </InfoRow>
      </InfoContainer>
    </Container>
  );
}

