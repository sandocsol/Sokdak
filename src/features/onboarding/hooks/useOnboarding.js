import { useState, useRef, useEffect } from 'react';
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
  
  // 최신 onboardingData를 추적하기 위한 ref
  const onboardingDataRef = useRef(onboardingData);
  
  // onboardingData가 변경될 때마다 ref 업데이트
  useEffect(() => {
    onboardingDataRef.current = onboardingData;
  }, [onboardingData]);
  
  // location.state에서 회원가입 정보 가져오기 (이메일, 비밀번호 등)
  const registrationInfo = location.state || {};

  // 단계별 데이터 업데이트
  const updateStepData = (stepData) => {
    console.log('[updateStepData] 업데이트 전:', onboardingDataRef.current);
    console.log('[updateStepData] 받은 데이터:', stepData);
    setOnboardingData((prev) => {
      const updated = {
        ...prev,
        ...stepData,
      };
      console.log('[updateStepData] 업데이트 후:', updated);
      onboardingDataRef.current = updated; // ref도 즉시 업데이트
      return updated;
    });
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
      // ref에서 최신 상태 가져오기 (클로저 문제 방지)
      const currentData = onboardingDataRef.current;
      
      // 디버깅: 현재 onboardingData 상태 확인
      console.log('[handleComplete] 현재 onboardingData (ref):', currentData);
      console.log('[handleComplete] gender 값:', currentData.gender);
      console.log('[handleComplete] gender 타입:', typeof currentData.gender);
      console.log('[handleComplete] gender 길이:', currentData.gender?.length);

      // 필수 데이터 검증
      if (!currentData.email || !currentData.password) {
        throw new Error('이메일과 비밀번호를 입력해주세요.');
      }

      if (!currentData.name || !currentData.gender) {
        console.error('[handleComplete] 검증 실패 - name:', currentData.name, 'gender:', currentData.gender);
        throw new Error('이름과 성별을 입력해주세요.');
      }

      if (!currentData.selections || currentData.selections.length !== 5) {
        throw new Error('모든 카테고리를 선택해주세요.');
      }

      // 성별을 API 형식으로 변환 (남성 -> male, 여성 -> female)
      // 백엔드가 소문자로 처리하므로 소문자로 전송
      const genderMapping = {
        '남성': 'male',
        '여성': 'female',
      };
      
      // gender 값 확인 및 변환
      const inputGender = currentData.gender?.trim();
      if (!inputGender) {
        console.error('[handleComplete] gender가 빈 문자열입니다.');
        throw new Error('성별을 선택해주세요.');
      }
      
      const apiGender = genderMapping[inputGender];
      if (!apiGender) {
        // 매핑에 없는 값이면 에러
        console.error('[handleComplete] 알 수 없는 성별 값:', inputGender);
        throw new Error(`알 수 없는 성별 값입니다: ${inputGender}`);
      }

      // 회원가입 API 요청 데이터 구성
      const registerData = {
        email: currentData.email,
        password: currentData.password,
        name: currentData.name,
        nickname: null,
        avatarUrl: registrationInfo.avatarUrl || '',
        gender: apiGender, // 백엔드가 소문자로 처리하므로 "male" 또는 "female"
        selections: currentData.selections,
      };

      // 디버깅: 전송할 데이터 로그
      console.log('[회원가입] 전송할 데이터:', registerData);
      console.log('[회원가입] 성별 변환:', { 
        원본: inputGender, 
        변환: apiGender,
        'gender 필드 존재 여부': 'gender' in registerData,
        'gender 값': registerData.gender
      });

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

