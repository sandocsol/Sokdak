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
  padding: clamp(40px, 10vh, 101px) 30px 0 30px;
  flex-shrink: 0;
  width: 100%;
  
  @media (max-height: 700px) {
    padding: 30px 30px 30px 30px;
  }
`;

// 뒤로가기 버튼 wrapper
const BackButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 100%;
  padding-left: 27px;
  margin-top: clamp(10px, 2vh, 20px);
  flex-shrink: 0;
  
  @media (max-height: 700px) {
    margin-top: 10px;
  }
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
  font-size: 18px;
  line-height: 26px;
  color: #cfcfcf;
  margin: 0;
  padding: 0 30px;
  margin-top: clamp(20px, 8vh, 75px);
  flex-shrink: 0;
  text-align: center;
  
  @media (max-height: 700px) {
    margin-top: 20px;
  }
`;

// 성격 옵션 컨테이너
const OptionsContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: clamp(15px, 3vh, 28px) 30px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  
  @media (max-height: 700px) {
    padding: 15px 30px;
  }
`;

const OptionItem = styled.button`
  width: 100%;
  max-width: 333px;
  margin: 0 auto;
  padding: 18px 77px;
  background: ${props => props.$selected ? '#2ab7ca' : '#353535'};
  border: 1px solid #2ab7ca;
  border-radius: 10px;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.5);
  font-family: 'Pretendard', sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 18px;
  color: #ffffff;
  text-align: center;
  cursor: pointer;
  outline: none;
  
  &:active {
    opacity: 0.8;
  }
`;

// 완료 버튼
const CompleteButton = styled.button`
  position: absolute;
  bottom: clamp(20px, 5vh, 50px);
  left: 50%;
  transform: translateX(-50%);
  width: 333px;
  max-width: calc(100% - 60px);
  height: 50px;
  padding: 11px 77px;
  background: ${props => props.$disabled ? '#b9d0d3' : '#2ab7ca'};
  border: none;
  border-radius: 10px;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.5);
  font-family: 'Pretendard', sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 18px;
  color: #ffffff;
  text-align: center;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  outline: none;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-height: 700px) {
    bottom: 20px;
  }
  
  &:active {
    opacity: ${props => props.$disabled ? 1 : 0.8};
  }
`;

// 카테고리별 옵션 목록
const CATEGORY_OPTIONS = {
  LEADERSHIP: ['비전형 리더', '섬세한 조율자', '카리스마형', '솔선수범형', '믿음직한 후원자'],
  CREATIVITY: ['아이디어 폭포', '실험정신 충만', '문제 해결사', '트렌드 세터', '관점 전환가'],
  TEAMWORK: ['분위기 메이커', '갈등 조정자', '든든한 서포터', '의사소통 챔피언', '배려왕'],
  PROFESSIONALISM: ['디테일 장인', '마감의 신', '데이터 기반형', '표준 수호자', '품질 집착러'],
  GROWTH: ['성장 모험가', '피드백 러버', '학습 전도사', '도전 설계자', '꾸준함의 아이콘'],
};

// 카테고리 코드 배열 (단계 순서)
const CATEGORY_ORDER = ['LEADERSHIP', 'CREATIVITY', 'TEAMWORK', 'PROFESSIONALISM', 'GROWTH'];

// 카테고리 한글 이름
const CATEGORY_NAMES = {
  LEADERSHIP: '리더십',
  CREATIVITY: '창의성',
  TEAMWORK: '팀워크',
  PROFESSIONALISM: '전문성',
  GROWTH: '성장',
};

// 카테고리별 질문 문구
const CATEGORY_QUESTIONS = {
  LEADERSHIP: '나는 어떤 리더십 스타일에 가까울까?',
  CREATIVITY: '나는 어떤 방식으로 창의성을 발휘할까?',
  TEAMWORK: '나는 팀에서 어떤 역할을 가장 잘 할까?',
  PROFESSIONALISM: '나는 어떤 업무 스타일을 가진 사람일까?',
  GROWTH: '나는 어떤 방식으로 성장하는 사람일까?',
};

export default function PersonalityStep({ currentStep = 3, totalSteps = 7, data, onUpdate, onNext, onBack, onComplete }) {
  // currentStep이 3~7이므로, 카테고리 인덱스는 currentStep - 3
  const categoryIndex = currentStep - 3;
  const categoryCode = CATEGORY_ORDER[categoryIndex];
  const categoryOptions = CATEGORY_OPTIONS[categoryCode] || [];
  const isLastStep = currentStep === totalSteps;

  // 현재 카테고리에 대한 선택된 옵션 찾기
  const currentSelection = data.selections?.find(s => s.categoryCode === categoryCode);
  const [selectedOption, setSelectedOption] = useState(currentSelection?.optionLabel || '');

  const handleSelectOption = (optionLabel) => {
    setSelectedOption(optionLabel);
    
    // selections 배열 업데이트
    const existingSelections = data.selections || [];
    const rank = categoryIndex + 1; // 1부터 시작하는 순위
    
    // 기존 선택 제거하고 새로 추가
    const updatedSelections = existingSelections.filter(s => s.categoryCode !== categoryCode);
    updatedSelections.push({
      categoryCode,
      optionLabel,
      rank,
    });
    
    // rank 순서대로 정렬
    updatedSelections.sort((a, b) => a.rank - b.rank);
    
    onUpdate({ selections: updatedSelections });
  };

  const handleNext = () => {
    if (isLastStep) {
      // 마지막 단계에서는 완료 처리
      if (onComplete) {
        onComplete();
      } else {
        onNext();
      }
    } else {
      onNext();
    }
  };

  return (
    <Container>
      <ProgressBarWrapper>
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      </ProgressBarWrapper>
      
      <BackButtonWrapper>
        <BackButton onClick={onBack}>
          <BackIcon />
        </BackButton>
      </BackButtonWrapper>

      <Title>{CATEGORY_QUESTIONS[categoryCode]}</Title>

      <OptionsContainer>
        {categoryOptions.map((option) => (
          <OptionItem
            key={option}
            $selected={selectedOption === option}
            onClick={() => handleSelectOption(option)}
          >
            {option}
          </OptionItem>
        ))}
      </OptionsContainer>

      <CompleteButton 
        onClick={handleNext}
        $disabled={!selectedOption}
        disabled={!selectedOption}
      >
        {isLastStep ? '시작하기' : '다음으로'}
      </CompleteButton>
    </Container>
  );
}

