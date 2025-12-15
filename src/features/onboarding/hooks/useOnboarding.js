import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth.js';
import { register } from '../../auth/api/authApi.js';

const TOTAL_STEPS = 7;
const STORAGE_KEY = 'onboarding_data';

// 단계별 라우트 매핑
const STEP_ROUTES = {
  1: 'email-password',
  2: 'name-gender',
  3: 'personality-1',
  4: 'personality-2',
  5: 'personality-3',
  6: 'personality-4',
  7: 'personality-5',
};

// 라우트에서 단계 번호로 변환
const ROUTE_TO_STEP = {
  'email-password': 1,
  'name-gender': 2,
  'personality-1': 3,
  'personality-2': 4,
  'personality-3': 5,
  'personality-4': 6,
  'personality-5': 7,
};

/**
 * 온보딩 프로세스를 관리하는 커스텀 훅
 * @returns {object} { currentStep, onboardingData, updateStepData, handleNext, handleBack, handleComplete, loading, error }
 */
export default function useOnboarding() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const { login } = useAuth();
  
  // URL에서 단계 읽기 (라우트 이름으로)
  const routeName = params.step || 'email-password';
  const stepFromRoute = ROUTE_TO_STEP[routeName] || 1;
  const [currentStep, setCurrentStep] = useState(stepFromRoute);
  
  // localStorage에서 데이터 복원
  const loadStoredData = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load onboarding data from localStorage:', error);
    }
    return {
      email: '',
      password: '',
      name: '',
      gender: '',
      selections: [], // { categoryCode, optionLabel, rank } 배열
    };
  };

  const [onboardingData, setOnboardingData] = useState(loadStoredData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // 최신 onboardingData를 추적하기 위한 ref
  const onboardingDataRef = useRef(onboardingData);
  
  // onboardingData가 변경될 때마다 ref 업데이트 및 localStorage 저장
  useEffect(() => {
    onboardingDataRef.current = onboardingData;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(onboardingData));
    } catch (error) {
      console.error('Failed to save onboarding data to localStorage:', error);
    }
  }, [onboardingData]);

  // URL 라우트가 변경되면 currentStep 업데이트
  useEffect(() => {
    const routeName = params.step || 'email-password';
    const stepFromRoute = ROUTE_TO_STEP[routeName] || 1;
    if (stepFromRoute >= 1 && stepFromRoute <= TOTAL_STEPS) {
      setCurrentStep(stepFromRoute);
    } else {
      navigate('/onboarding/email-password', { replace: true });
    }
  }, [params.step, navigate]);

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
    // 마지막 단계가 아니면 다음 단계로 이동
    if (currentStep < TOTAL_STEPS) {
      const nextStep = currentStep + 1;
      const nextRoute = STEP_ROUTES[nextStep];
      setCurrentStep(nextStep);
      navigate(`/onboarding/${nextRoute}`, { replace: true });
    }
    // handleComplete는 PersonalityStep에서 마지막 단계일 때만 호출됨
  };

  // 이전 단계로 이동
  const handleBack = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      const prevRoute = STEP_ROUTES[prevStep];
      setCurrentStep(prevStep);
      navigate(`/onboarding/${prevRoute}`, { replace: true });
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
          // localStorage에서 온보딩 데이터 삭제
          localStorage.removeItem(STORAGE_KEY);
          navigate('/');
          return;
        } catch {
          // 로그인 실패 시 로그인 페이지로 이동
          // (에러 메시지 출력하지 않음 - 서버가 아직 준비되지 않았을 수 있음)
          localStorage.removeItem(STORAGE_KEY);
          navigate('/login');
          return;
        }
      }

      // 회원가입만 성공하고 자동 로그인을 시도하지 않은 경우 홈으로 이동
      localStorage.removeItem(STORAGE_KEY);
      navigate('/');
    } catch (err) {
      console.error('회원가입 실패:', err);
      setError(err);
      const errorMessage = err.response?.data?.message || err.message || '회원가입 중 오류가 발생했습니다.';
      
      // 이메일 중복 에러인 경우 첫 단계로 이동
      if (errorMessage.includes('이메일') || errorMessage.includes('email') || errorMessage.includes('중복') || errorMessage.includes('duplicate')) {
        navigate('/onboarding/email-password', { replace: true });
        setCurrentStep(1);
      }
      
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

