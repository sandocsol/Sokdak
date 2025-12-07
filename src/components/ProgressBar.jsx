import styled from "styled-components";

const ProgressBarContainer = styled.div`
  display: flex;
  gap: 6px;
  justify-content: center;
  align-items: center;
  height: 6px;
  width: 100%;
  max-width: 100%;
`;

const ProgressStep = styled.div`
  flex: 1;
  height: 6px;
  border-radius: 5px;
  background: ${(props) => (props.$active ? "#2ab7ca" : "#d9d9d9")};
  min-width: 0;
`;

/**
 * ProgressBar 컴포넌트
 * @param {number} currentStep - 현재 진행 단계 (1부터 시작)
 * @param {number} totalSteps - 전체 단계 수
 * @param {string} className - 추가 CSS 클래스명
 */
export default function ProgressBar({ currentStep = 1, totalSteps = 6, className }) {
  return (
    <ProgressBarContainer className={className}>
      {Array.from({ length: totalSteps }, (_, index) => (
        <ProgressStep key={index} $active={index + 1 <= currentStep} />
      ))}
    </ProgressBarContainer>
  );
}

