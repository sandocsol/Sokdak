import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import ProgressBar from "../components/ProgressBar.jsx";
import { getPraiseCategory } from "../features/praise/mockData.js";
import MemberSelector from "../features/praise/components/MemberSelector.jsx";

const Container = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #222222;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  position: relative;
  padding-top: 61px; /* StatusBar 높이 */
  padding-bottom: 20px;
`;

const BackButton = styled.button`
  position: absolute;
  left: 27px;
  top: 139px;
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  
  svg {
    width: 100%;
    height: 100%;
  }
`;

const ProgressBarWrapper = styled.div`
  margin: 0 auto;
  margin-top: 20px;
  display: flex;
  justify-content: center;
`;

const Title = styled.h2`
  font-family: "Pretendard", -apple-system, BlinkMacSystemFont, sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 26px;
  color: white;
  text-align: center;
  margin-top: 60px;
  margin-bottom: 0;
`;

const CategoryCard = styled.div`
  width: 322px;
  height: 156px;
  background: #353535;
  border-radius: 10px;
  margin: 0 auto;
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const Emoji = styled.div`
  font-size: 55px;
  line-height: 1;
  margin-bottom: 10px;
`;

const CategoryText = styled.p`
  font-family: "Inter", "Noto Sans KR", sans-serif;
  font-weight: bold;
  font-size: 16px;
  color: #cfcfcf;
  text-align: center;
  margin: 0;
`;

const OptionsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 338px; /* MemberSelector 그리드 너비: (160px * 2) + 18px gap */
  margin: 54px auto 20px auto;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  background: #fffdfd;
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  color: #cfcfcf;
  cursor: pointer;
`;

const OptionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  
  font-family: "Pretendard", sans-serif;
  font-weight: 600;
  font-size: 13px;
  line-height: 18px;
  color: #cfcfcf;
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const ContentWrapper = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;
  min-height: 0; /* flex item이 overflow를 제대로 처리하도록 */
`;

const SendButton = styled.button`
  width: 157px;
  height: 49px;
  background: #2ab7ca;
  border: none;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  margin-top: auto;
  margin-bottom: 20px;
  cursor: pointer;
  flex-shrink: 0;
  
  font-family: "Pretendard", sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 18px;
  color: white;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:active {
    opacity: 0.8;
  }
`;

// 뒤로가기 아이콘 SVG
const BackIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M23.3333 26.6667L16.6667 20L23.3333 13.3333"
      stroke="#9E9E9E"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// 건너뛰기 아이콘 SVG (skip forward)
const SkipIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M3 3L13 8L3 13M13 3V13"
      stroke="#cfcfcf"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function PraisePage() {
  const navigate = useNavigate();
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [currentCategoryIndex] = useState(0); // 현재 칭찬 카테고리 인덱스

  // 목 데이터에서 현재 칭찬 카테고리 가져오기
  const currentCategory = getPraiseCategory(currentCategoryIndex);
  const users = currentCategory.users; // 서버에서 받아온 4명의 사용자

  // 초기 선택: 첫 번째 사용자를 기본 선택
  const [selectedUserId, setSelectedUserId] = useState(
    users.length > 0 ? users[0].id : null
  );

  const handleBack = () => {
    navigate(-1);
  };

  const handleSkip = () => {
    // 건너뛰기 로직
    navigate(-1);
  };

  const handleSend = () => {
    // 보내기 로직
    console.log("Selected user:", selectedUserId, "Anonymous:", isAnonymous);
    // TODO: 실제 전송 로직 구현
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={handleBack}>
          <BackIcon />
        </BackButton>
        
        <ProgressBarWrapper>
          <ProgressBar currentStep={3} totalSteps={6} />
        </ProgressBarWrapper>
        
        <Title>칭찬하고 싶은 사람을 선택해 주세요</Title>
      </Header>

      <ContentWrapper>
        <CategoryCard>
          <Emoji>{currentCategory.emoji}</Emoji>
          <CategoryText>{currentCategory.text}</CategoryText>
        </CategoryCard>

        <OptionsRow>
          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              id="anonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
            />
            <CheckboxLabel htmlFor="anonymous">익명</CheckboxLabel>
          </CheckboxContainer>
          
          <OptionButton onClick={handleSkip}>
            건너뛰기
            <SkipIcon />
          </OptionButton>
        </OptionsRow>

        <MemberSelector
          users={users}
          selectedUserId={selectedUserId}
          onSelect={setSelectedUserId}
        />

        <SendButton onClick={handleSend}>보내기</SendButton>
      </ContentWrapper>
    </Container>
  );
}
