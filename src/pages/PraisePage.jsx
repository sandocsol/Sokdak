import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import ProgressBar from "../components/ProgressBar.jsx";
import usePraiseCategories from "../features/praise/hooks/usePraiseCategories.js";
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
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  outline: none;
  
  &:focus {
    outline: none;
  }
  
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
  margin-top: 22px;
  margin-bottom: 0;
`;

const BackButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 100%;
  padding-left: 27px;
  margin-top: 20px;
`;

const CategoryCard = styled.div`
  width: 322px;
  height: 156px;
  background: #353535;
  border-radius: 10px;
  margin: 0 auto;
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
  color: #ffffff;
  text-align: center;
  margin: 0;
`;

const OptionsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 338px; /* MemberSelector 그리드 너비: (160px * 2) + 18px gap */
  margin: 54px auto 10px auto;
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
  background: ${(props) => (props.checked ? "#2ab7ca" : "#fffdfd")};
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  position: relative;
  outline: none;
  
  &:focus {
    outline: none;
  }
  
  &:checked::after {
    content: "✓";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 14px;
    font-weight: bold;
    line-height: 1;
  }
  
  &:checked {
    border-color: #2ab7ca;
  }
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
  outline: none;
  
  &:focus {
    outline: none;
  }
  
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
  background: ${(props) => (props.disabled ? "#B9D0D3" : "#2ab7ca")};
  border: none;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  margin-top: auto;
  margin-bottom: 20px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  flex-shrink: 0;
  outline: none;
  
  &:focus {
    outline: none;
  }
  
  font-family: "Pretendard", sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 18px;
  color: white;
  
  &:hover {
    opacity: ${(props) => (props.disabled ? 1 : 0.9)};
  }
  
  &:active {
    opacity: ${(props) => (props.disabled ? 1 : 0.8)};
  }
`;

// 뒤로가기 아이콘 SVG
const BackIcon = () => (
  <svg width="40px" height="40px" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(13.33, 8.33)">
      <path
        d="M11.67 0L0 11.67L11.67 23.33"
        stroke="#9E9E9E"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
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
  const { data: praiseCategories, loading, error } = usePraiseCategories();
  const [isAnonymous, setIsAnonymous] = useState(true); // 기본값: 익명 선택
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0); // 현재 칭찬 카테고리 인덱스

  // 현재 칭찬 카테고리 가져오기
  const currentCategory = praiseCategories?.[currentCategoryIndex];
  const users = currentCategory?.users || []; // 서버에서 받아온 4명의 사용자

  // 초기 선택: 아무것도 선택되지 않은 상태
  const [selectedUserId, setSelectedUserId] = useState(null);

  // 카테고리가 변경될 때마다 선택 상태를 초기화
  useEffect(() => {
    setSelectedUserId(null);
    setIsAnonymous(true); // 각 칭찬마다 익명을 기본값으로 리셋
  }, [currentCategoryIndex]);

  const handleBack = () => {
    // BackButton 클릭 시 홈 화면으로 이동
    navigate("/");
  };

  const handleNext = () => {
    // 다음 칭찬으로 이동하거나 모든 칭찬을 완료하면 홈으로 이동
    if (praiseCategories && currentCategoryIndex < praiseCategories.length - 1) {
      setCurrentCategoryIndex(currentCategoryIndex + 1);
    } else {
      // 모든 칭찬을 완료했을 때 홈 화면으로 이동
      navigate("/");
    }
  };

  const handleSkip = () => {
    // 건너뛰기: 다음 칭찬으로 이동
    handleNext();
  };

  const handleSend = () => {
    // 선택된 사용자가 없으면 실행하지 않음
    if (selectedUserId === null) {
      return;
    }
    
    // 보내기: 선택한 사용자와 익명 여부를 저장하고 다음 칭찬으로 이동
    console.log("Selected user:", selectedUserId, "Anonymous:", isAnonymous);
    console.log("Category:", currentCategory.text);
    // TODO: 실제 전송 로직 구현 (API 호출 등)
    
    // 다음 칭찬으로 이동
    handleNext();
  };

  // 로딩 중이거나 에러가 있거나 데이터가 없을 때 처리
  if (loading) {
    return (
      <Container>
        <Title>로딩 중...</Title>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Title>데이터를 불러오는 중 오류가 발생했습니다.</Title>
      </Container>
    );
  }

  if (!praiseCategories || !currentCategory) {
    return (
      <Container>
        <Title>데이터를 찾을 수 없습니다.</Title>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <ProgressBarWrapper>
          <ProgressBar currentStep={currentCategoryIndex + 1} totalSteps={praiseCategories.length} />
        </ProgressBarWrapper>
        
        <BackButtonWrapper>
          <BackButton onClick={handleBack}>
            <BackIcon />
          </BackButton>
        </BackButtonWrapper>
        
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

        <SendButton onClick={handleSend} disabled={selectedUserId === null}>
          보내기
        </SendButton>
      </ContentWrapper>
    </Container>
  );
}
