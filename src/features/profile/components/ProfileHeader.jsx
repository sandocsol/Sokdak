import styled from "styled-components";
import useProfile from "../hooks/useProfile.js";

// 로컬 assets 아이콘 경로
const SETTING_ICON = "/assets/profile-setting.svg";
const EDIT_ICON = "/assets/profile-edit.svg";

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
`;

const ProfileImage = styled.img`
  width: 87px;
  height: 87px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #50555C;
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

const University = styled.p`
  font-family: 'Inter', 'Noto Sans KR', sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: normal;
  color: #2ab7ca;
  margin: 0;
  white-space: nowrap;
`;

const ClubsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ClubItem = styled.p`
  font-family: 'Pretendard', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: normal;
  color: #ffffff;
  margin: 0;
  white-space: nowrap;
`;

const ActionButtons = styled.div`
  position: absolute;
  top: 93px;
  right: 34px;
  display: flex;
  align-items: center;
  gap: 11px;
`;

const ButtonWrapper = styled.div`
  position: relative;
  width: 30px;
  height: 30px;
`;

const ButtonBackground = styled.div`
  position: absolute;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  top: 0;
  left: 0;
`;

const IconButton = styled.button`
  width: 30px;
  height: 30px;
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
  width: 21px;
  height: 21px;
  object-fit: contain;
`;

const EditIcon = styled.img`
  width: 21px;
  height: 21px;
  object-fit: contain;
`;

export default function ProfileHeader({ profile: profileProp }) {
  const { data: profileData, loading, error } = useProfile();
  const profile = profileProp || profileData;

  const handleSettingClick = () => {
    console.log("Setting clicked");
    // TODO: 설정 페이지로 이동
  };

  const handleEditClick = () => {
    console.log("Edit clicked");
    // TODO: 프로필 편집 모달 열기
  };

  const handleAddClick = () => {
    console.log("Add clicked");
    // TODO: 프로필 이미지 추가/변경
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
      </ActionButtons>

      <ProfileSection>
        <ProfileImageWrapper>
          <ProfileImage src={profile.profileImage} alt={profile.name} />
          <AddButton onClick={handleAddClick} aria-label="프로필 이미지 추가">
            <AddButtonText>+</AddButtonText>
          </AddButton>
        </ProfileImageWrapper>

        <ProfileInfo>
          <UserName>{profile.name}</UserName>
          <University>{profile.university}</University>
          <ClubsList>
            {profile.clubs.map((club) => (
              <ClubItem key={club.id}>{club.name}</ClubItem>
            ))}
          </ClubsList>
        </ProfileInfo>
      </ProfileSection>
    </HeaderContainer>
  );
}

