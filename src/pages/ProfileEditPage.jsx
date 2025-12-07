import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../features/auth/useAuth.js';

const Container = styled.div`
  width: 100%;
  height: 100%;
  background: #222222;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 90px 30px 20px 30px;
  flex-shrink: 0;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;


const BackButton = styled.button`
  width: 30px;
  height: 30px;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  outline: none;
  
  &:hover {
    opacity: 0.8;
  }
  
  &:focus,
  &:focus-visible {
    outline: none;
    border: none;
  }
`;

const ChevronIcon = styled.svg`
  width: 100%;
  height: 100%;
  stroke: #cfcfcf;
`;

const Title = styled.h1`
  font-family: 'Pretendard', sans-serif;
  font-weight: 500;
  font-size: 22px;
  line-height: 24px;
  color: #cfcfcf;
  margin: 0;
`;

const Divider = styled.div`
  width: 100%;
  height: 10px;
  background: #353535;
  flex-shrink: 0;
`;

const ProfileImageSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
  padding: 47px 0 28px 0;
  flex-shrink: 0;
`;

const ProfileImageWrapper = styled.div`
  position: relative;
  width: 110px;
  height: 110px;
  border-radius: 50%;
  border: 1px solid #50555c;
  overflow: hidden;
  ${props => props.$isPlaceholder ? `
    display: flex;
    align-items: center;
    justify-content: center;
  ` : ''}
`;

const ProfileImage = styled.img`
  ${props => props.$isPlaceholder ? `
    width: 70%;
    height: 70%;
    border-radius: 50%;
  ` : `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 0;
  `}
  object-fit: cover;
  object-position: center;
  display: block;
`;

const ChangeImageButton = styled.button`
  border: 1.5px solid #2ab7ca;
  border-radius: 10px;
  padding: 8px 10px;
  background: transparent;
  font-family: 'Pretendard', sans-serif;
  font-weight: 600;
  font-size: 14px;
  line-height: 16px;
  color: #2ab7ca;
  cursor: pointer;
  outline: none;
  
  &:hover {
    background: rgba(42, 183, 202, 0.1);
  }
  
  &:active {
    opacity: 0.8;
  }
  
  &:focus,
  &:focus-visible {
    outline: none;
  }
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0 35px;
  flex: 1;
  padding-bottom: 40px;
`;

const FormRow = styled.div`
  display: flex;
  gap: 27px;
  align-items: center;
  padding: 10px 12px;
  border-bottom: 1px solid #585858;
  min-height: 36px;
`;

const Label = styled.label`
  font-family: 'Pretendard', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 16px;
  color: #9f9f9f;
  width: 70px;
  flex-shrink: 0;
`;

const FieldValue = styled.div`
  flex: 1;
  border: none;
  background: transparent;
  font-family: 'Pretendard', sans-serif;
  font-weight: 500;
  font-size: 16px;
  line-height: 18px;
  color: #cfcfcf;
  padding: 9px 0;
  cursor: pointer;
  
  &:hover {
    color: #2ab7ca;
  }
  
  &:focus,
  &:focus-visible {
    outline: none;
  }
`;

const ClubsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
`;

const ClubItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 0 19px 0;
  border-bottom: 1px solid #585858;
  min-height: 36px;
`;

const ClubName = styled.span`
  font-family: 'Pretendard', sans-serif;
  font-weight: 500;
  font-size: 16px;
  line-height: 18px;
  color: #cfcfcf;
`;

const DeleteButton = styled.button`
  font-family: 'Pretendard', sans-serif;
  font-weight: 600;
  font-size: 14px;
  line-height: 16px;
  color: #9f9f9f;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  outline: none;
  
  &:hover {
    color: #ff4444;
  }
  
  &:focus,
  &:focus-visible {
    outline: none;
    border: none;
  }
`;

const AddClubButton = styled.button`
  display: flex;
  align-items: center;
  padding: 9px 0;
  min-height: 36px;
  background: none;
  border: none;
  /* border-bottom: 1px solid #585858; */
  cursor: pointer;
  outline: none;
  width: 100%;
  
  &:focus,
  &:focus-visible {
    outline: none;
    border: none;
  }
`;

const AddClubText = styled.span`
  font-family: 'Pretendard', sans-serif;
  font-weight: 500;
  font-size: 16px;
  line-height: 18px;
  color: #9f9f9f;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #353535;
  border-radius: 12px;
  padding: 24px;
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ModalMessage = styled.p`
  font-family: 'Pretendard', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #cfcfcf;
  margin: 0;
  text-align: center;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const ModalButton = styled.button`
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  font-family: 'Pretendard', sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  cursor: pointer;
  border: none;
  outline: none;
  
  &:focus,
  &:focus-visible {
    outline: none;
  }
`;

const CancelButton = styled(ModalButton)`
  background: #50555c;
  color: #cfcfcf;
  
  &:hover {
    background: #5a5f66;
  }
`;

const ConfirmButton = styled(ModalButton)`
  background: #ff4444;
  color: #ffffff;
  
  &:hover {
    background: #ff5555;
  }
`;

export default function ProfileEditPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  
  const [name, setName] = useState('');
  const [university, setUniversity] = useState('');
  const [clubs, setClubs] = useState([]);
  const [profileImage, setProfileImage] = useState('');
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);

  // 사용자 정보로 폼 초기화
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setUniversity(user.university || '');
      setClubs(user.clubs || []);
      setProfileImage(user.profileImage || '');
    }
  }, [user]);

  // 플레이스홀더 이미지인지 확인 (profile.svg만 플레이스홀더로 취급)
  // 실제 렌더링되는 src 값을 기준으로 판단
  const isPlaceholderImage = () => {
    const src = profileImage || '/assets/profile.svg';
    // profile.svg만 플레이스홀더로 취급 (profile-mock.jpg는 실제 프로필 이미지)
    return src.includes('profile.svg');
  };

  // 뒤로가기
  const handleBack = () => {
    navigate('/mypage');
  };

  // 프로필 이미지 변경
  const handleImageChange = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageUrl = event.target.result;
          setProfileImage(imageUrl);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  // 동아리 탈퇴 모달 열기
  const handleLeaveClubClick = (club) => {
    setSelectedClub(club);
    setShowLeaveModal(true);
  };

  // 동아리 탈퇴 확인
  const handleConfirmLeave = () => {
    if (selectedClub) {
      setClubs(clubs.filter(club => club.id !== selectedClub.id));
      setShowLeaveModal(false);
      setSelectedClub(null);
    }
  };

  // 탈퇴 모달 닫기
  const handleCancelLeave = () => {
    setShowLeaveModal(false);
    setSelectedClub(null);
  };

  // 동아리 추가
  const handleAddClub = () => {
    navigate('/club/search');
  };

  // 이름 편집 페이지로 이동
  const handleNameClick = () => {
    navigate('/profile/edit/name', { state: { currentValue: name } });
  };

  // 학교 편집 페이지로 이동
  const handleUniversityClick = () => {
    navigate('/profile/edit/university', { state: { currentValue: university } });
  };

  // 성별 편집 페이지로 이동
  const handleGenderClick = () => {
    navigate('/profile/edit/gender');
  };

  if (loading) {
    return (
      <Container>
        <p style={{ color: '#ffffff', textAlign: 'center', padding: '20px' }}>
          로딩 중...
        </p>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container>
        <p style={{ color: '#ffffff', textAlign: 'center', padding: '20px' }}>
          사용자 정보를 불러올 수 없습니다.
        </p>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <BackButton onClick={handleBack} aria-label="뒤로가기">
            <ChevronIcon viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18L9 12L15 6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </ChevronIcon>
          </BackButton>
          <Title>프로필 편집</Title>
        </HeaderLeft>
      </Header>

      <Divider />

      <ProfileImageSection>
        <ProfileImageWrapper $isPlaceholder={isPlaceholderImage()}>
          <ProfileImage
            src={profileImage || '/assets/profile.svg'}
            alt="프로필 이미지"
            $isPlaceholder={isPlaceholderImage()}
          />
        </ProfileImageWrapper>
        <ChangeImageButton onClick={handleImageChange}>
          프로필 사진 변경
        </ChangeImageButton>
      </ProfileImageSection>
      <FormSection>
        <FormRow>
          <Label>이름</Label>
          <FieldValue onClick={handleNameClick}>
            {name || '이름을 입력하세요'}
          </FieldValue>
        </FormRow>

        <FormRow>
          <Label>학교</Label>
          <FieldValue onClick={handleUniversityClick}>
            {university || '학교를 입력하세요'}
          </FieldValue>
        </FormRow>

        <FormRow style={{ alignItems: 'flex-start' }}>
          <Label style={{ paddingTop: '10px' }}>동아리</Label>
          <ClubsList>
            {clubs.map((club) => (
              <ClubItem key={club.id}>
                <ClubName>{club.name}</ClubName>
                <DeleteButton onClick={() => handleLeaveClubClick(club)}>
                  탈퇴
                </DeleteButton>
              </ClubItem>
            ))}
            <AddClubButton onClick={handleAddClub}>
              <AddClubText>동아리 추가</AddClubText>
            </AddClubButton>
          </ClubsList>
        </FormRow>

        <FormRow>
          <Label>성별</Label>
          <FieldValue onClick={handleGenderClick}>
            {user?.gender || '성별을 선택하세요'}
          </FieldValue>
        </FormRow>
      </FormSection>

      {showLeaveModal && selectedClub && (
        <ModalOverlay onClick={handleCancelLeave}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalMessage>
              {selectedClub.name}에서 탈퇴하시겠습니까?
            </ModalMessage>
            <ModalButtons>
              <CancelButton onClick={handleCancelLeave}>
                취소
              </CancelButton>
              <ConfirmButton onClick={handleConfirmLeave}>
                탈퇴하기
              </ConfirmButton>
            </ModalButtons>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
}

