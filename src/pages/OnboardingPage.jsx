import styled from 'styled-components';
import useOnboarding from '../features/onboarding/hooks/useOnboarding.js';
import NameAndGenderStep from '../features/onboarding/components/NameAndGenderStep.jsx';
import UniversityStep from '../features/onboarding/components/UniversityStep.jsx';
import ClubStep from '../features/onboarding/components/ClubStep.jsx';
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

export default function OnboardingPage() {
  const {
    currentStep,
    onboardingData,
    updateStepData,
    handleNext,
    handleBack,
    loading,
  } = useOnboarding();

  // 현재 단계에 맞는 컴포넌트 렌더링
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <NameAndGenderStep
            currentStep={currentStep}
            data={onboardingData}
            onUpdate={updateStepData}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <UniversityStep
            currentStep={currentStep}
            data={onboardingData}
            onUpdate={updateStepData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <ClubStep
            currentStep={currentStep}
            data={onboardingData}
            onUpdate={updateStepData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <PersonalityStep
            currentStep={currentStep}
            data={onboardingData}
            onUpdate={updateStepData}
            onNext={handleNext}
            onBack={handleBack}
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

