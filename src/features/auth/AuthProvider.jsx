import { useState, useEffect, useMemo } from 'react';
import { AuthContext } from './AuthContext.js';
import { getUserProfile } from '../profile/api/userApi.js';

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
      setLoading(true);
      setError(null);

      try {
        const userData = await getUserProfile();
        if (!cancelled) {
          // 성별이 없으면 기본값 설정 (여성)
          if (!userData.gender) {
            userData.gender = '여성';
          }
          // selectedClubId가 없으면 첫 번째 동아리로 설정
          if (!userData.selectedClubId && userData.clubs && userData.clubs.length > 0) {
            userData.selectedClubId = userData.clubs[0].id.toString();
          }
          setUser(userData);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err);
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
   * 로그인 함수 (향후 인증 로직 추가 가능)
   */
  const login = async (userData) => {
    setUser(userData);
    setError(null);
  };

  /**
   * 로그아웃 함수
   */
  const logout = () => {
    setUser(null);
    setError(null);
  };

  /**
   * 사용자 정보 업데이트 함수
   */
  const updateUser = (updatedUserData) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...updatedUserData,
    }));
  };

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
    [user, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

