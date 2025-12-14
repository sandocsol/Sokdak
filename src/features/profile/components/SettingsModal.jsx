import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { useAuth } from '../../auth/useAuth.js';
import { deleteUserProfile } from '../api/userApi.js';
import { useNavigate } from 'react-router-dom';

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
`;

const ModalContainer = styled.div`
  background: #222222;
  border-radius: 20px 20px 0 0;
  padding: 28px;
  width: 100%;
  max-width: 500px;
  position: relative;
`;

const ModalTitle = styled.h2`
  font-family: 'Inter', 'Noto Sans KR', sans-serif;
  font-weight: 700;
  font-size: 20px;
  color: #ffffff;
  margin: 0 0 24px 0;
`;

const MenuList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const MenuItem = styled.button`
  width: 100%;
  padding: 16px 0;
  background: none;
  border: none;
  border-bottom: 1px solid #333333;
  color: ${props => props.$danger ? '#ff4444' : '#ffffff'};
  font-family: 'Inter', 'Noto Sans KR', sans-serif;
  font-size: 16px;
  text-align: left;
  cursor: pointer;
  outline: none;
  
  &:hover {
    background: #2a2a2a;
  }
  
  &:active {
    background: #333333;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: #9f9f9f;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  
  &:hover {
    background: #333333;
    color: #ffffff;
  }
`;

/**
 * 설정 모달 컴포넌트
 * logout() 함수를 사용하여 로그아웃 기능을 제공합니다
 */
export default function SettingsModal({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [portalContainer, setPortalContainer] = useState(null);

  // PhoneFrame 요소 찾기 (AppShell 내부)
  useEffect(() => {
    if (isOpen) {
      const phoneFrame = document.querySelector('[data-phone-frame="true"]');
      if (phoneFrame) {
        setPortalContainer(phoneFrame);
      } else {
        // 폴백: body에 렌더링 (기존 동작)
        setPortalContainer(document.body);
      }
    }
  }, [isOpen]);

  // ESC 키로 모달 닫기
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // 오버레이 클릭 시 모달 닫기
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 로그아웃 처리
  const handleLogout = async () => {
    if (confirm('로그아웃하시겠습니까?')) {
      try {
        await logout();
        onClose();
        navigate('/login');
      } catch (error) {
        console.error('로그아웃 실패:', error);
        // 에러가 발생해도 로그인 페이지로 이동
        navigate('/login');
      }
    }
  };

  // 회원탈퇴 처리
  const handleDeleteAccount = async () => {
    if (confirm('정말 회원탈퇴를 하시겠습니까?\n탈퇴 후에는 모든 데이터가 삭제되며 복구할 수 없습니다.')) {
      try {
        await deleteUserProfile();
        alert('회원탈퇴가 완료되었습니다.');
        logout();
        onClose();
        navigate('/');
      } catch (error) {
        console.error('회원탈퇴 실패:', error);
        alert('회원탈퇴 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  // 비밀번호 변경 처리
  const handleChangePassword = () => {
    alert('비밀번호 변경 기능은 준비 중입니다.');
    onClose();
  };

  if (!isOpen || !user || !portalContainer) {
    return null;
  }

  const modalContent = (
    <Overlay onClick={handleOverlayClick}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose} aria-label="닫기">
          ×
        </CloseButton>
        
        <ModalTitle>설정</ModalTitle>

        <MenuList>
          <MenuItem onClick={handleLogout}>
            로그아웃
          </MenuItem>
          <MenuItem onClick={handleChangePassword}>
            비밀번호 변경
          </MenuItem>
          <MenuItem $danger onClick={handleDeleteAccount}>
            회원탈퇴
          </MenuItem>
        </MenuList>
      </ModalContainer>
    </Overlay>
  );

  return createPortal(modalContent, portalContainer);
}

