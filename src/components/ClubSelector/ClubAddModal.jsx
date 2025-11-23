import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import useProfile from "../../features/profile/hooks/useProfile.js";

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(118, 118, 118, 0.6);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
`;

const ModalContainer = styled.div`
  background: #222222;
  width: 100%;
  border-radius: 20px 20px 0 0;
  padding: 26px 27px;
  padding-bottom: 26px;
  position: relative;
  box-sizing: border-box;
`;

const ModalButtonContainer = styled.div`
  width: 100%;
  border: 1px solid #9f9f9f;
  border-radius: 20px;
  box-sizing: border-box;
`;

const ClubList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const ClubItem = styled.button`
  width: 100%;
  min-height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 33px;
  background: none;
  border: none;
  border-bottom: 1px solid #9f9f9f;
  border-radius: 0;
  cursor: pointer;
  outline: none;
  
  &:focus {
    outline: none;
  }
  
  &:hover {
    opacity: 0.8;
  }
  
  &:active {
    opacity: 0.6;
  }
`;

const LastClubItem = styled(ClubItem)`
  border-bottom: none;
`;

const ClubItemContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  flex: 1;
`;

const ClubText = styled.p`
  font-family: "Inter", "Noto Sans KR", sans-serif;
  font-weight: 400;
  font-size: 18px;
  line-height: 1.2;
  color: #9f9f9f;
  margin: 0;
  text-align: left;
`;

const ClubNameWithUniversity = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  gap: 0;
  
  ${ClubText} {
    font-size: 18px;
    white-space: nowrap;
    
    &:last-child {
      font-size: 14px;
      margin-left: 4px;
    }
  }
`;

const CheckIcon = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  svg {
    width: 100%;
    height: 100%;
  }
`;

const PlusIcon = styled.div`
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-right: 12px;
  
  svg {
    width: 100%;
    height: 100%;
  }
`;

// Checkmark icon SVG
const CheckmarkIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#2ab7ca" />
    <path
      d="M7 12L10.5 15.5L17 9"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Plus icon SVG
const PlusIconSvg = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="14" cy="14" r="14" fill="#222222" />
    <path
      d="M14 8V20M8 14H20"
      stroke="#9f9f9f"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * ClubAddModal 컴포넌트
 * 동아리 선택 및 추가를 위한 모달 컴포넌트
 * @param {Array} clubs - 동아리 목록 [{ id, name, university }, ...]
 * @param {string|null} selectedClubId - 현재 선택된 동아리 ID
 * @param {Function} onSelectClub - 동아리 선택 시 호출되는 콜백 함수 (clubId) => void
 * @param {Function} onClose - 모달 닫기 콜백 함수
 */
export default function ClubAddModal({
  clubs = [],
  selectedClubId = null,
  onSelectClub,
  onClose,
}) {
  const navigate = useNavigate();
  const [phoneFrame, setPhoneFrame] = useState(null);
  const { data: profileData } = useProfile();

  // PhoneFrame 찾기
  useEffect(() => {
    const frame = document.querySelector('[data-phone-frame="true"]');
    if (frame) {
      setPhoneFrame(frame);
    }
  }, []);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  // 오버레이 클릭 시 모달 닫기
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleClubSelect = (clubId) => {
    onSelectClub?.(clubId);
  };

  const handleAddClub = () => {
    onClose();
    navigate("/club/search");
  };

  // 프로필 데이터에서 동아리 목록 가져오기
  const userClubs = profileData?.clubs?.map((club) => ({
    id: club.id.toString(),
    name: club.name,
    university: profileData.university,
  })) || [];

  // 기본 동아리 목록 (clubs prop이 있으면 사용, 없으면 프로필 데이터 사용)
  const defaultClubs = clubs.length > 0 ? clubs : userClubs;

  const modalContent = (
    <Overlay onClick={handleOverlayClick}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalButtonContainer>
          <ClubList>
            {defaultClubs.map((club) => {
              const isSelected = selectedClubId === club.id;
              return (
                <ClubItem
                  key={club.id}
                  onClick={() => handleClubSelect(club.id)}
                >
                  <ClubItemContent>
                    {club.university ? (
                      <ClubNameWithUniversity>
                        <ClubText>{club.name} </ClubText>
                        <ClubText>{club.university}</ClubText>
                      </ClubNameWithUniversity>
                    ) : (
                      <ClubText>{club.name}</ClubText>
                    )}
                  </ClubItemContent>
                  {isSelected && (
                    <CheckIcon>
                      <CheckmarkIcon />
                    </CheckIcon>
                  )}
                </ClubItem>
              );
            })}
            
            <LastClubItem onClick={handleAddClub}>
              <ClubItemContent>
                <PlusIcon>
                  <PlusIconSvg />
                </PlusIcon>
                <ClubText>동아리 추가하기</ClubText>
              </ClubItemContent>
            </LastClubItem>
          </ClubList>
        </ModalButtonContainer>
      </ModalContainer>
    </Overlay>
  );

  // PhoneFrame을 찾았으면 Portal로 렌더링, 아니면 일반 렌더링
  if (!phoneFrame) {
    return null; // PhoneFrame을 찾을 때까지 렌더링하지 않음
  }

  return createPortal(modalContent, phoneFrame);
}

