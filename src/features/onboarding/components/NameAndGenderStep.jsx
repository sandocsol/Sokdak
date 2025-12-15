import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import ProgressBar from '../../../components/ProgressBar.jsx';

const Container = styled.div`
  width: 100%;
  height: 100%;
  background: #222222;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`;

// 진행 바 wrapper
const ProgressBarWrapper = styled.div`
  padding: 101px 30px 0 30px;
  flex-shrink: 0;
  width: 100%;
  
  @media (max-height: 700px) {
    padding: 30px 30px 30px 30px;
  }
`;

// 제목
const Title = styled.h1`
  font-family: 'Pretendard', sans-serif;
  font-weight: 600;
  font-size: 24px;
  line-height: 26px;
  color: #cfcfcf;
  margin: 0;
  padding: 0 30px;
  margin-top: 75px;
  flex-shrink: 0;
`;

// 이름 입력 필드
const NameInputContainer = styled.div`
  padding: 28px 30px 0 30px;
  flex-shrink: 0;
`;

const NameInput = styled.input`
  width: 100%;
  max-width: 333px;
  height: 60px;
  background: #585858;
  border: none;
  border-radius: 25px;
  font-family: 'Pretendard', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 18px;
  color: #ffffff;
  padding: 16px 20px;
  outline: none;
  margin: 0 auto;
  display: block;
  
  &:focus {
    background: #666666;
  }
  
  &::placeholder {
    color: #bababa;
  }
`;

// 성별 선택 필드
const GenderSelectContainer = styled.div`
  padding: 18px 30px 0 30px;
  flex-shrink: 0;
  position: relative;
`;

const GenderSelectButton = styled.button`
  width: 100%;
  max-width: 335px;
  height: 60px;
  background: #585858;
  border: none;
  border-radius: 25px;
  font-family: 'Pretendard', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 18px;
  color: ${props => props.$hasValue ? '#ffffff' : '#bababa'};
  padding: 21px 20px;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 auto;
  cursor: pointer;
  
  &:active {
    background: #666666;
  }
`;

const ChevronIcon = styled.svg`
  width: 21px;
  height: 10px;
  transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  transition: transform 0.2s;
  stroke: #bababa;
`;

// 성별 드롭다운
const GenderDropdown = styled.div`
  position: absolute;
  top: 83px;
  left: 50%;
  transform: translateX(-50%);
  width: 335px;
  max-width: calc(100% - 60px);
  background: #585858;
  border: 1px solid #8c8c8c;
  border-radius: 25px;
  overflow: hidden;
  z-index: 10;
  display: ${props => props.$isOpen ? 'block' : 'none'};
`;

const GenderOption = styled.button`
  width: 100%;
  height: 50px;
  background: transparent;
  border: none;
  border-bottom: ${props => props.$isLast ? 'none' : '1px solid #8c8c8c'};
  font-family: 'Pretendard', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 18px;
  color: #ffffff;
  padding: 16px 0 16px 70px;
  outline: none;
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  
  &:active {
    background: #666666;
  }
`;

const GenderIcon = styled.div`
  position: absolute;
  left: 21px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MaleIcon = styled.svg`
  width: 100%;
  height: 100%;
  fill: #2ab7ca;
`;

const FemaleIcon = styled.svg`
  width: 100%;
  height: 100%;
  fill: #ff6b6b;
`;

// 다음 버튼
const NextButton = styled.button`
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  width: 333px;
  max-width: calc(100% - 60px);
  height: 50px;
  background: ${props => props.$disabled ? '#B9D0D3' : '#2ab7ca'};
  border: none;
  border-radius: 10px;
  font-family: 'Pretendard', sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 18px;
  color: #ffffff;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  outline: none;
  flex-shrink: 0;
  padding: 11px 77px;
  
  &:active {
    opacity: ${props => props.$disabled ? 1 : 0.8};
  }
`;

export default function NameAndGenderStep({ currentStep = 1, totalSteps = 6, data, onUpdate, onNext }) {
  const [name, setName] = useState(data.name || '');
  const [gender, setGender] = useState(data.gender || '');
  const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsGenderDropdownOpen(false);
      }
    };

    if (isGenderDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isGenderDropdownOpen]);

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    onUpdate({ name: value });
  };

  const handleGenderSelect = (selectedGender) => {
    console.log('[NameAndGenderStep] 성별 선택:', selectedGender);
    setGender(selectedGender);
    setIsGenderDropdownOpen(false);
    console.log('[NameAndGenderStep] onUpdate 호출 - gender:', selectedGender);
    onUpdate({ gender: selectedGender });
  };

  const handleNextClick = () => {
    if (name.trim() && gender) {
      onNext();
    }
  };

  const isNextDisabled = !name.trim() || !gender;

  return (
    <Container>
      <ProgressBarWrapper>
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      </ProgressBarWrapper>

      <Title>이름과 성별을 입력해주세요</Title>

      <NameInputContainer>
        <NameInput
          type="text"
          value={name}
          onChange={handleNameChange}
          placeholder="이름을 입력하세요"
          autoFocus
        />
      </NameInputContainer>

      <GenderSelectContainer ref={dropdownRef}>
        <GenderSelectButton
          $hasValue={!!gender}
          onClick={() => setIsGenderDropdownOpen(!isGenderDropdownOpen)}
        >
          {gender || '성별'}
          <ChevronIcon
            viewBox="0 0 21 10"
            fill="none"
            $isOpen={isGenderDropdownOpen}
          >
            <path
              d="M1 1L10.5 9L20 1"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </ChevronIcon>
        </GenderSelectButton>

        <GenderDropdown $isOpen={isGenderDropdownOpen}>
          <GenderOption
            onClick={() => handleGenderSelect('남성')}
            $isLast={false}
          >
            <GenderIcon>
              <MaleIcon viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="3" fill="#2ab7ca" />
                <path d="M12 11C8 11 4 13 4 17V20H20V17C20 13 16 11 12 11Z" fill="#2ab7ca" />
              </MaleIcon>
            </GenderIcon>
            남성
          </GenderOption>
          <GenderOption
            onClick={() => handleGenderSelect('여성')}
            $isLast={true}
          >
            <GenderIcon>
              <FemaleIcon viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="3" fill="#ff6b6b" />
                <path d="M12 11C8 11 4 13 4 17V20H20V17C20 13 16 11 12 11Z" fill="#ff6b6b" />
              </FemaleIcon>
            </GenderIcon>
            여성
          </GenderOption>
        </GenderDropdown>
      </GenderSelectContainer>

      <NextButton
        $disabled={isNextDisabled}
        onClick={handleNextClick}
        disabled={isNextDisabled}
      >
        다음으로
      </NextButton>
    </Container>
  );
}

