import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth.js';
import { register } from '../../auth/api/authApi.js';

const TOTAL_STEPS = 7;

/**
 * 온보딩 프로세스를 관리하는 커스텀 훅
 * @returns {object} { currentStep, onboardingData, updateStepData, handleNext, handleBack, handleComplete, loading, error }
 */
export default function useOnboarding() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState({
    email: '',
    password: '',
    name: '',
    gender: '',
    selections: [], // { categoryCode, optionLabel, rank } 배열
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // location.state에서 회원가입 정보 가져오기 (이메일, 비밀번호 등)
  const registrationInfo = location.state || {};

  // 단계별 데이터 업데이트
  const updateStepData = (stepData) => {
    setOnboardingData((prev) => ({
      ...prev,
      ...stepData,
    }));
  };

  // 다음 단계로 이동
  const handleNext = async () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    } else {
      // 마지막 단계: 온보딩 완료
      await handleComplete();
    }
  };

  // 이전 단계로 이동
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // 온보딩 완료 (회원가입 API 호출)
  const handleComplete = async () => {
    setLoading(true);
    setError(null);

    try {
      // 필수 데이터 검증
      if (!onboardingData.email || !onboardingData.password) {
        throw new Error('이메일과 비밀번호를 입력해주세요.');
      }

      if (!onboardingData.name || !onboardingData.gender) {
        throw new Error('이름과 성별을 입력해주세요.');
      }

      if (!onboardingData.selections || onboardingData.selections.length !== 5) {
        throw new Error('모든 카테고리를 선택해주세요.');
      }

      // 성별을 API 형식으로 변환 (남성 -> male, 여성 -> female)
      const genderMapping = {
        '남성': 'male',
        '여성': 'female',
      };
      const apiGender = genderMapping[onboardingData.gender] || onboardingData.gender;

      // 회원가입 API 요청 데이터 구성
      const registerData = {
        email: onboardingData.email,
        password: onboardingData.password,
        name: onboardingData.name,
        nickname: null,
        avatarUrl: registrationInfo.avatarUrl || '',
        gender: apiGender,
        selections: onboardingData.selections,
      };

      // 회원가입 API 호출
      await register(registerData);

      // 회원가입 성공 후 자동 로그인 (사용자 정보 로드는 건너뜀 - 서버가 아직 준비되지 않았을 수 있음)
      if (registerData.email && registerData.password) {
        try {
          // skipUserProfile 옵션으로 사용자 정보 로드를 건너뜀 (500 에러 방지)
          await login({
            email: registerData.email,
            password: registerData.password,
          }, { skipUserProfile: true });
          
          // 자동 로그인 성공 시 홈으로 이동
          navigate('/');
          return;
        } catch {
          // 로그인 실패 시 로그인 페이지로 이동
          // (에러 메시지 출력하지 않음 - 서버가 아직 준비되지 않았을 수 있음)
          navigate('/login');
          return;
        }
      }

      // 회원가입만 성공하고 자동 로그인을 시도하지 않은 경우 홈으로 이동
      navigate('/');
    } catch (err) {
      console.error('회원가입 실패:', err);
      setError(err);
      const errorMessage = err.response?.data?.message || err.message || '회원가입 중 오류가 발생했습니다.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    currentStep,
    totalSteps: TOTAL_STEPS,
    onboardingData,
    updateStepData,
    handleNext,
    handleBack,
    handleComplete,
    loading,
    error,
  };
}

