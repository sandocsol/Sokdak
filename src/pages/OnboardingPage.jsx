import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import useOnboarding from '../features/onboarding/hooks/useOnboarding.js';
import EmailPasswordStep from '../features/onboarding/components/EmailPasswordStep.jsx';
import NameAndGenderStep from '../features/onboarding/components/NameAndGenderStep.jsx';
import PersonalityStep from '../features/onboarding/components/PersonalityStep.jsx';

const Container = styled.div`
  width: 100%;
  height: 100%;
  background: #222222;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
`;

// 라우트 이름에서 단계 번호로 변환
const ROUTE_TO_STEP = {
  'email-password': 1,
  'name-gender': 2,
  'personality-1': 3,
  'personality-2': 4,
  'personality-3': 5,
  'personality-4': 6,
  'personality-5': 7,
};

export default function OnboardingPage() {
  const navigate = useNavigate();
  const params = useParams();
  
  const {
    currentStep,
    totalSteps,
    onboardingData,
    updateStepData,
    handleNext,
    handleBack,
    handleComplete,
    loading,
  } = useOnboarding();

  // URL 파라미터가 없으면 첫 단계로 리다이렉트
  useEffect(() => {
    if (!params.step) {
      navigate('/onboarding/email-password', { replace: true });
    } else {
      // 유효하지 않은 라우트인 경우 첫 단계로 리다이렉트
      const routeName = params.step;
      if (!ROUTE_TO_STEP[routeName]) {
        navigate('/onboarding/email-password', { replace: true });
      }
    }
  }, [params.step, navigate]);

  // 현재 단계에 맞는 컴포넌트 렌더링
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <EmailPasswordStep
            currentStep={currentStep}
            totalSteps={totalSteps}
            data={onboardingData}
            onUpdate={updateStepData}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <NameAndGenderStep
            currentStep={currentStep}
            totalSteps={totalSteps}
            data={onboardingData}
            onUpdate={updateStepData}
            onNext={handleNext}
          />
        );
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        return (
          <PersonalityStep
            currentStep={currentStep}
            totalSteps={totalSteps}
            data={onboardingData}
            onUpdate={updateStepData}
            onNext={handleNext}
            onBack={handleBack}
            onComplete={handleComplete}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Container>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100%',
          color: '#cfcfcf',
          fontFamily: 'Pretendard, sans-serif',
          fontSize: '16px'
        }}>
          처리 중...
        </div>
      </Container>
    );
  }

  return <Container>{renderStep()}</Container>;
}

