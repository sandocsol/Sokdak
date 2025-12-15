import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import useCreateClub from "../features/club/hooks/useCreateClub.js";
import { useAuth } from "../features/auth/useAuth.js";
import ProgressBar from "../components/ProgressBar.jsx";

const Container = styled.div`
  width: 100%;
  height: 100%;
  background: #222222;
  position: relative;
  overflow: hidden;
`;

const BackButton = styled.button`
  position: absolute;
  left: 23px;
  top: 139px;
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  
  &:hover {
    opacity: 0.8;
  }
  
  &:active {
    opacity: 0.6;
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const ProgressBarWrapper = styled.div`
  position: absolute;
  left: 50%;
  top: 97px;
  transform: translateX(-50%);
  width: 333px;
  padding: 0 30px;
  
  @media (max-height: 700px) {
    top: 30px;
    padding: 30px 30px 30px 30px;
  }
`;

const Title = styled.p`
  font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-weight: 500;
  font-size: 20px;
  line-height: 26px;
  color: #cfcfcf;
  margin: 0;
  position: absolute;
  left: 30px;
  top: 202px;
  width: 311px;
  text-align: left;
`;

// Step 1: 동아리명 입력
const NameInputContainer = styled.div`
  position: absolute;
  left: 50%;
  top: 255px;
  transform: translateX(-50%);
  width: 333px;
  height: 50px;
  background: ${(props) => (props.focused ? "#585858" : "#585858")};
  border: ${(props) => (props.focused ? "1px solid #2AB7CA" : "none")};
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 14px;
  box-sizing: border-box;
`;

const NameInput = styled.input`
  flex: 1;
  background: none;
  border: none;
  outline: none;
  font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 18px;
  color: white;
  padding: 0;
  margin: 0;
  
  &::placeholder {
    color: #9f9f9f;
  }
`;

const SearchIcon = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-left: 8px;
  
  svg {
    width: 100%;
    height: 100%;
  }
`;

const SearchIconSvg = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="11" r="7" stroke="#cfcfcf" strokeWidth="2" />
    <path d="M20 20L16 16" stroke="#cfcfcf" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// Step 2: 동아리 설명 입력
const DescriptionContainer = styled.div`
  position: absolute;
  left: 50%;
  top: 256px;
  transform: translateX(-50%);
  width: 330px;
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const DescriptionTextarea = styled.textarea`
  width: 100%;
  height: 80px;
  background: #585858;
  border: ${(props) => (props.focused ? "1px solid #BABABA" : "1px solid #BABABA")};
  border-radius: 10px;
  padding: 16px 14px;
  box-sizing: border-box;
  font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 18px;
  color: ${(props) => (props.hasValue ? "white" : "#BABABA")};
  resize: none;
  outline: none;
  
  &::placeholder {
    color: #BABABA;
  }
`;

const CharacterCount = styled.p`
  font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
  color: #BABABA;
  margin: 0;
  text-align: right;
  margin-top: 4px;
  margin-right: 0;
`;

const CreateButton = styled.button`
  position: absolute;
  left: 50%;
  top: 707px;
  transform: translateX(-50%);
  width: 333px;
  height: 50px;
  background: ${(props) => (props.disabled ? "#B9D0D3" : "#2AB7CA")};
  border: none;
  border-radius: 10px;
  padding: 11px 77px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  
  font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 18px;
  color: white;
  text-align: center;
  white-space: nowrap;
  
  &:hover {
    opacity: ${(props) => (props.disabled ? 1 : 0.9)};
  }
  
  &:active {
    opacity: ${(props) => (props.disabled ? 1 : 0.8)};
  }
`;

export default function ClubCreatePage() {
  const navigate = useNavigate();
  const { create, loading: isSubmitting } = useCreateClub();
  const { reloadUser } = useAuth();
  const [step, setStep] = useState(1); // 1: 이름 입력, 2: 설명 입력
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [nameFocused, setNameFocused] = useState(false);

  const handleBack = () => {
    if (step === 1) {
      navigate(-1);
    } else {
      setStep(1);
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    if (value.length <= 30) {
      setDescription(value);
    }
  };

  const handleNameNext = () => {
    if (name.trim()) {
      setStep(2);
    }
  };

  const handleCreate = async () => {
    if (!name.trim() || !description.trim() || isSubmitting) {
      return;
    }

    const requestData = {
      name: name.trim(),
      description: description.trim(),
    };

    console.log("동아리 생성 요청:", requestData);

    try {
      const response = await create(requestData);
      
      // 동아리 생성 성공 후 사용자 프로필을 다시 불러와서 동아리 목록 갱신
      try {
        await reloadUser();
      } catch (reloadError) {
        console.warn('사용자 프로필 재로드 실패 (무시됨):', reloadError);
        // 프로필 재로드 실패해도 동아리 생성은 성공했으므로 계속 진행
      }
      
      // 생성 성공 시 동아리 페이지로 이동
      if (response.clubId) {
        navigate(`/club/${response.clubId}`);
      } else {
        // 응답에 clubId가 없을 경우 이전 페이지로 이동
        navigate(-1);
      }
    } catch (err) {
      console.error("동아리 생성 실패:", err);
      console.error("에러 상세 정보:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        requestData: {
          name: name.trim(),
          description: description.trim(),
        }
      });
      
      // 서버에서 보낸 에러 메시지가 있으면 표시
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          "동아리 생성에 실패했습니다. 다시 시도해주세요.";
      alert(errorMessage);
    }
  };

  const isNameStepValid = name.trim().length > 0;
  const isDescriptionStepValid = description.trim().length > 0;
  const isCreateButtonDisabled = 
    (step === 1 && !isNameStepValid) || 
    (step === 2 && (!isNameStepValid || !isDescriptionStepValid)) ||
    isSubmitting;

  return (
    <Container>
      <BackButton onClick={handleBack}>
        <img src="/assets/Chevron_Left.svg" alt="뒤로 가기" />
      </BackButton>

      <ProgressBarWrapper>
        <ProgressBar currentStep={step} totalSteps={2} />
      </ProgressBarWrapper>

      {step === 1 && (
        <>
          <Title>동아리명을 입력해주세요</Title>
          <NameInputContainer focused={nameFocused}>
            <NameInput
              type="text"
              placeholder="동아리 이름"
              value={name}
              onChange={handleNameChange}
              onFocus={() => setNameFocused(true)}
              onBlur={() => setNameFocused(false)}
            />
            <SearchIcon>
              <SearchIconSvg />
            </SearchIcon>
          </NameInputContainer>
        </>
      )}

      {step === 2 && (
        <>
          <Title>동아리에 대한 설명을 남겨주세요</Title>
          <DescriptionContainer>
            <DescriptionTextarea
              placeholder="설명 입력"
              value={description}
              onChange={handleDescriptionChange}
              hasValue={description.length > 0}
            />
            <CharacterCount>{description.length}/30</CharacterCount>
          </DescriptionContainer>
        </>
      )}

      <CreateButton
        disabled={isCreateButtonDisabled}
        onClick={step === 1 ? handleNameNext : handleCreate}
      >
        {isSubmitting ? "생성 중..." : "동아리 생성하기"}
      </CreateButton>
    </Container>
  );
}

