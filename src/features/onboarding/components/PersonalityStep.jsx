import { useState } from 'react';
import styled from 'styled-components';
import ProgressBar from '../../../components/ProgressBar.jsx';

const Container = styled.div`
  width: 100%;
  height: 100%;
  background: #222222;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`;

// 진행 바 wrapper
const ProgressBarWrapper = styled.div`
  padding: 101px 30px 0 30px;
  flex-shrink: 0;
  width: 100%;
`;

// 뒤로가기 버튼 wrapper
const BackButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 100%;
  padding-left: 27px;
  margin-top: 20px;
  flex-shrink: 0;
`;

// 뒤로가기 버튼
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
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  
  &:focus {
    outline: none;
    box-shadow: none;
  }
  
  &:focus-visible {
    outline: none;
    box-shadow: none;
  }
  
  &:active {
    opacity: 0.8;
    outline: none;
    box-shadow: none;
  }
  
  svg {
    width: 100%;
    height: 100%;
  }
`;

// 뒤로가기 아이콘 컴포넌트
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

// 제목
const Title = styled.h1`
  font-family: 'Pretendard', sans-serif;
  font-weight: 600;
  font-size: 24px;
  line-height: 26px;
  color: #cfcfcf;
  margin: 0;
  padding: 0 30px;
  margin-top: 75px;
  flex-shrink: 0;
`;

// 성격 옵션 컨테이너
const OptionsContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 28px 30px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const OptionItem = styled.button`
  width: 100%;
  max-width: 333px;
  margin: 0 auto;
  padding: 16px 20px;
  background: ${props => props.$selected ? '#2ab7ca' : '#585858'};
  border: none;
  border-radius: 25px;
  font-family: 'Pretendard', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 18px;
  color: #ffffff;
  text-align: left;
  cursor: pointer;
  outline: none;
  
  &:active {
    opacity: 0.8;
  }
`;

// 건너뛰기 버튼
const SkipButton = styled.button`
  position: absolute;
  bottom: 110px;
  left: 50%;
  transform: translateX(-50%);
  background: none;
  border: none;
  font-family: 'Pretendard', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 18px;
  color: #9f9f9f;
  cursor: pointer;
  outline: none;
  
  &:active {
    opacity: 0.8;
  }
`;

// 완료 버튼
const CompleteButton = styled.button`
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  width: 333px;
  max-width: calc(100% - 60px);
  height: 50px;
  background: ${props => props.$disabled ? '#b9d0d3' : '#2ab7ca'};
  border: none;
  border-radius: 25px;
  font-family: 'Pretendard', sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 18px;
  color: #ffffff;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  outline: none;
  flex-shrink: 0;
  
  &:active {
    opacity: ${props => props.$disabled ? 1 : 0.8};
  }
`;

// 성격 옵션 목록 (예시)
const PERSONALITY_OPTIONS = [
  '활발한',
  '조용한',
  '친근한',
  '진지한',
  '유머러스한',
  '책임감 있는',
  '창의적인',
  '논리적인',
];

export default function PersonalityStep({ currentStep = 4, data, onUpdate, onNext, onBack }) {
  const [selectedPersonality, setSelectedPersonality] = useState(data.personality || '');

  const handleSelectPersonality = (personality) => {
    setSelectedPersonality(personality);
    onUpdate({ personality });
  };

  const handleComplete = () => {
    onNext(); // 마지막 단계이므로 완료 처리
  };

  const handleSkip = () => {
    onUpdate({ personality: '' });
    onNext();
  };

  return (
    <Container>
      <ProgressBarWrapper>
        <ProgressBar currentStep={currentStep} totalSteps={4} />
      </ProgressBarWrapper>
      
      <BackButtonWrapper>
        <BackButton onClick={onBack}>
          <BackIcon />
        </BackButton>
      </BackButtonWrapper>

      <Title>성격을 선택해주세요</Title>

      <OptionsContainer>
        {PERSONALITY_OPTIONS.map((personality) => (
          <OptionItem
            key={personality}
            $selected={selectedPersonality === personality}
            onClick={() => handleSelectPersonality(personality)}
          >
            {personality}
          </OptionItem>
        ))}
      </OptionsContainer>

      <SkipButton onClick={handleSkip}>건너뛰기</SkipButton>

      <CompleteButton onClick={handleComplete}>
        완료하기
      </CompleteButton>
    </Container>
  );
}

