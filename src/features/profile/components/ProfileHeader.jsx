import styled from "styled-components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth.js";
import SettingsModal from "./SettingsModal.jsx";
import usePendingMembers from "../../notification/hooks/usePendingMembers.js";

// 로컬 assets 아이콘 경로
const SETTING_ICON = "/assets/profile-setting.svg";
const EDIT_ICON = "/assets/profile-edit.svg";
const BELL_ICON = "/assets/bell.svg";

const HeaderContainer = styled.div`
  position: relative;
  width: 100%;
  padding: 90px 34px 28px 34px;
  background: #222222;
  box-sizing: border-box;
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 42px;
  position: relative;
`;

const ProfileImageWrapper = styled.div`
  position: relative;
  width: 87px;
  height: 87px;
  flex-shrink: 0;
  border-radius: 50%;
  border: 1px solid #50555C;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const ProfileImage = styled.img`
  width: ${props => props.$isPlaceholder ? '70%' : '100%'};
  height: ${props => props.$isPlaceholder ? '70%' : '100%'};
  border-radius: 50%;
  object-fit: cover;
`;

const AddButton = styled.button`
  position: absolute;
  right: 0px;
  bottom: 0;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #9F9F9F;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  outline: none;
  
  &:hover {
    background: #f0f0f0;
  }
  
  &:active {
    background: #e0e0e0;
  }
  
  &:focus {
    outline: none;
  }
  
  &:focus-visible {
    outline: none;
  }
`;

const AddButtonText = styled.span`
  font-family: 'Pretendard', sans-serif;
  font-weight: 600;
  font-size: 20px;
  line-height: 18px;
  color: #000000;
  text-align: center;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  margin-top: 13px;
  padding-right: 120px; /* 버튼들이 겹치지 않도록 오른쪽 여백 추가 */
`;

const UserName = styled.h2`
  font-family: 'Inter', 'Noto Sans KR', sans-serif;
  font-weight: 700;
  font-size: 20px;
  line-height: normal;
  color: #ffffff;
  margin: 0;
  white-space: nowrap;
`;

// const University = styled.p`
//   font-family: 'Inter', 'Noto Sans KR', sans-serif;
//   font-weight: 400;
//   font-size: 12px;
//   line-height: normal;
//   color: #2ab7ca;
//   margin: 0;
//   white-space: nowrap;
// `;

const ClubsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ClubItem = styled.p`
  font-family: 'Inter', 'Noto Sans KR', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: normal;
  color: #2ab7ca;
  margin: 0;
  white-space: nowrap;
`;

const ActionButtons = styled.div`
  position: absolute;
  top: 93px;
  right: 34px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ButtonWrapper = styled.div`
  position: relative;
  width: 24px;
  height: 24px;
`;

const ButtonBackground = styled.div`
  position: absolute;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  top: 0;
  left: 0;
`;

const IconButton = styled.button`
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  outline: none;
  
  &:hover {
    opacity: 0.8;
  }
  
  &:active {
    opacity: 0.6;
  }
  
  &:focus {
    outline: none;
  }
  
  &:focus-visible {
    outline: none;
  }
`;

const SettingIcon = styled.img`
  width: 18px;
  height: 18px;
  object-fit: contain;
`;

const EditIcon = styled.img`
  width: 15px;
  height: 15px;
  object-fit: contain;
`;

const BellIcon = styled.img`
  width: 18px;
  height: 18px;
  object-fit: contain;
`;

const NotificationBadge = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #2AB7CA;
  pointer-events: none;
`;

export default function ProfileHeader({ profile: profileProp }) {
  const { user: profileData, loading, error, updateUser } = useAuth();
  const profile = profileProp || profileData;
  const navigate = useNavigate();
  const { notifications } = usePendingMembers();
  
  // 모달 상태 관리
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  
  // 알림이 있는지 확인
  const hasNotifications = notifications && notifications.length > 0;

  // 설정 모달 열기
  const handleSettingClick = () => {
    setIsSettingsModalOpen(true);
  };

  // 프로필 편집 페이지로 이동
  const handleEditClick = () => {
    navigate('/profile/edit');
  };

  // 알림 페이지로 이동
  const handleNotificationClick = () => {
    navigate('/notifications');
  };

  // 프로필 이미지 변경
  const handleAddClick = () => {
    // 간단한 예시: 파일 입력 다이얼로그
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        // 파일을 읽어서 미리보기 URL 생성
        const reader = new FileReader();
        reader.onload = async (event) => {
          const imageUrl = event.target.result;
          try {
            // updateUser()로 프로필 이미지 업데이트
            await updateUser({ profileImage: imageUrl });
            alert('프로필 이미지가 변경되었습니다!');
          } catch (error) {
            console.error('프로필 이미지 업데이트 실패:', error);
            alert('프로필 이미지 변경에 실패했습니다. 다시 시도해주세요.');
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  if (loading) {
    return (
      <HeaderContainer>
        <ProfileSection>
          <ProfileInfo>
            <UserName>로딩 중...</UserName>
          </ProfileInfo>
        </ProfileSection>
      </HeaderContainer>
    );
  }

  if (error || !profile) {
    return (
      <HeaderContainer>
        <ProfileSection>
          <ProfileInfo>
            <UserName>데이터를 불러올 수 없습니다.</UserName>
          </ProfileInfo>
        </ProfileSection>
      </HeaderContainer>
    );
  }

  return (
    <HeaderContainer>
      <ActionButtons>
        <ButtonWrapper>
          <ButtonBackground />
          <IconButton onClick={handleSettingClick} aria-label="설정">
            <SettingIcon src={SETTING_ICON} alt="설정" />
          </IconButton>
        </ButtonWrapper>
        <ButtonWrapper>
          <ButtonBackground />
          <IconButton onClick={handleEditClick} aria-label="편집">
            <EditIcon src={EDIT_ICON} alt="편집" />
          </IconButton>
        </ButtonWrapper>
        <ButtonWrapper>
          <ButtonBackground />
          <IconButton onClick={handleNotificationClick} aria-label="알림">
            <BellIcon src={BELL_ICON} alt="알림" />
            {hasNotifications && <NotificationBadge />}
          </IconButton>
        </ButtonWrapper>
      </ActionButtons>

      <ProfileSection>
        <ProfileImageWrapper>
          <ProfileImage 
            src={profile.profileImage || '/assets/profile.svg'} 
            alt={profile.name}
            $isPlaceholder={!profile.profileImage || profile.profileImage.includes('profile.svg')}
          />
        </ProfileImageWrapper>

        <ProfileInfo>
          <UserName>{profile.name}</UserName>
          {/* <University>{profile.university}</University> */}
          <ClubsList>
            {profile.clubs.map((club) => (
              <ClubItem key={club.id}>{club.name}</ClubItem>
            ))}
          </ClubsList>
        </ProfileInfo>
      </ProfileSection>

      {/* 설정 모달 */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </HeaderContainer>
  );
}

