import { useState, useEffect, useMemo, useCallback } from 'react';
import { AuthContext } from './AuthContext.js';
import { getUserProfile, updateUserProfile } from '../profile/api/userApi.js';
import { login as loginApi, logout as logoutApi } from './api/authApi.js';
import { SKIP_AUTH } from '../../lib/apiClient.js';

/**
 * 인증 상태와 사용자 정보를 제공하는 Provider 컴포넌트
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 사용자 프로필 로드
  useEffect(() => {
    let cancelled = false;

    async function loadUser() {
      // 인증이 필요 없는 페이지에서는 사용자 정보를 로드하지 않음
      const currentPath = window.location.pathname;
      const publicPaths = ['/onboarding', '/login'];
      const isPublicPath = publicPaths.some(path => currentPath === path || currentPath.startsWith(path));
      
      if (isPublicPath) {
        // 회원가입/로그인 페이지에서는 사용자 정보를 로드하지 않음 (에러 방지)
        setLoading(false);
        setError(null);
        setUser(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const userData = await getUserProfile();
        if (!cancelled) {
          // selectedClubId가 없으면 첫 번째 동아리로 설정
          if (!userData.selectedClubId && userData.clubs && userData.clubs.length > 0) {
            userData.selectedClubId = userData.clubs[0].id.toString();
          }
          
          // 성별을 프론트엔드 표시 형식으로 변환 (male -> 남성, female -> 여성)
          const genderDisplayMapping = {
            'male': '남성',
            'female': '여성',
          };
          if (userData.gender && genderDisplayMapping[userData.gender]) {
            userData.gender = genderDisplayMapping[userData.gender];
          }
          
          setUser(userData);
        }
      } catch (err) {
        if (!cancelled) {
          const status = err.response?.status;
          const isUnauthorized = status === 401;
          
          if (isUnauthorized) {
            // 401 에러는 apiClient 인터셉터에서 로그인 페이지로 리다이렉트 처리
            // 여기서는 상태만 초기화
            setError(null);
            setUser(null);
          } else if (SKIP_AUTH) {
            // 인증 우회 모드에서는 에러가 아님
            setError(null);
            setUser(null);
          } else {
            // 다른 에러는 실제 에러로 처리
            setError(err);
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadUser();

    return () => {
      cancelled = true;
    };
  }, []);

  /**
   * 로그인 함수
   * @param {object} credentials - 로그인 정보 { username, password } 또는 { email, password }
   * @param {object} options - 옵션 { skipUserProfile: boolean } - 사용자 정보 로드를 건너뛸지 여부
   * @returns {Promise} 로그인 성공 시 사용자 정보
   */
  const login = async (credentials, options = {}) => {
    setError(null);
    
    // 현재 경로 확인 (온보딩 페이지에서 호출되는지 확인)
    const currentPath = window.location.pathname;
    const isOnboardingPath = currentPath === '/onboarding' || currentPath.startsWith('/onboarding');
    const skipUserProfile = options.skipUserProfile || isOnboardingPath;
    
    try {
      // 1. 로그인 API 호출 (서버가 JSESSIONID 쿠키를 설정하고 memberdto를 반환함)
      const loginResponse = await loginApi(credentials);
      
      // 온보딩 페이지에서는 사용자 정보 로드를 건너뜀 (서버가 아직 준비되지 않았을 수 있음)
      if (skipUserProfile) {
        setUser(null);
        setError(null);
        return null; // 사용자 정보 없이 성공 반환
      }
      
      // 2. 로그인 응답에서 사용자 정보 사용 (API 명세에 따르면 memberdto를 반환함)
      let userData = loginResponse;
      
      // 로그인 응답에 사용자 정보가 없는 경우 fallback으로 /api/members/me 호출
      if (!userData || !userData.id) {
        let retries = 3;
        let lastError;
        
        while (retries > 0) {
          try {
            userData = await getUserProfile();
            break; // 성공하면 루프 종료
          } catch (err) {
            lastError = err;
            const status = err.response?.status;
            
            // 500 에러이고 재시도 가능하면 재시도
            if (status >= 500 && retries > 1) {
              retries--;
              // 짧은 지연 후 재시도 (서버가 준비될 시간 제공)
              await new Promise(resolve => setTimeout(resolve, 1000));
              continue;
            }
            
            // 재시도 불가능하거나 다른 에러면 throw
            throw err;
          }
        }
        
        if (!userData) {
          throw lastError || new Error('사용자 정보를 불러올 수 없습니다.');
        }
      }
      
      if (!userData.selectedClubId && userData.clubs && userData.clubs.length > 0) {
        userData.selectedClubId = userData.clubs[0].id.toString();
      }
      
      // 성별을 프론트엔드 표시 형식으로 변환 (male -> 남성, female -> 여성)
      const genderDisplayMapping = {
        'male': '남성',
        'female': '여성',
      };
      if (userData.gender && genderDisplayMapping[userData.gender]) {
        userData.gender = genderDisplayMapping[userData.gender];
      }
      
      setUser(userData);
      return userData;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  /**
   * 로그아웃 함수
   */
  const logout = async () => {
    try {
      // 서버에 로그아웃 요청 (세션 무효화)
      await logoutApi();
    } catch (err) {
      // 로그아웃 API 호출 실패해도 클라이언트 상태는 초기화
      console.error('Logout API error:', err);
    } finally {
      // 클라이언트 상태 초기화
      setUser(null);
      setError(null);
      // 로그인 페이지로 리다이렉트
      window.location.href = '/login';
    }
  };

  /**
   * 사용자 정보 업데이트 함수
   * @param {object} updatedUserData - 업데이트할 사용자 데이터
   */
  const updateUser = useCallback(async (updatedUserData) => {
    try {
      // API 명세에 따라 허용된 필드만 포함 (name, nickname, avatarUrl)
      // gender는 회원정보 수정 API에서 지원하지 않으므로 제외
      // id는 명세에 없으며, 세션 쿠키(JSESSIONID)를 통해 현재 사용자를 식별함
      const allowedFields = ['name', 'nickname', 'avatarUrl'];
      const filteredData = Object.keys(updatedUserData)
        .filter(key => allowedFields.includes(key))
        .reduce((obj, key) => {
          obj[key] = updatedUserData[key];
          return obj;
        }, {});
      
      // 디버깅: 전송할 데이터 로그
      console.log('[updateUser] 전송할 데이터:', filteredData);
      
      // API 호출하여 서버에 업데이트
      // 세션 쿠키(JSESSIONID)를 통해 현재 사용자를 식별함
      const updatedUser = await updateUserProfile(filteredData);
      
      // API 응답의 성별을 프론트엔드 표시 형식으로 변환 (조회 시에만 사용)
      const genderDisplayMapping = {
        'male': '남성',
        'female': '여성',
      };
      if (updatedUser.gender && genderDisplayMapping[updatedUser.gender]) {
        updatedUser.gender = genderDisplayMapping[updatedUser.gender];
      }
      
      // 로컬 상태도 업데이트
      setUser((prevUser) => ({
        ...prevUser,
        ...updatedUser,
      }));
      
      return updatedUser;
    } catch (err) {
      console.error('사용자 정보 업데이트 실패:', err);
      // 400 에러의 경우 상세 메시지 출력
      if (err.response?.status === 400) {
        console.error('400 Bad Request 상세:', {
          status: err.response.status,
          data: err.response.data,
          requestData: updatedUserData,
        });
      }
      throw err;
    }
  }, []);

  /**
   * 선택된 동아리 변경 함수
   */
  const setSelectedClubId = (clubId) => {
    setUser((prevUser) => {
      if (!prevUser) return prevUser;
      return {
        ...prevUser,
        selectedClubId: clubId.toString(),
      };
    });
  };

  // Context에 제공할 값
  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      login,
      logout,
      updateUser,
      setSelectedClubId,
    }),
    [user, loading, error, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

