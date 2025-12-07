import { useState, useEffect } from 'react';
import styled from 'styled-components';
import useUniversities from '../../profile/hooks/useUniversities.js';
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
`;

// 뒤로가기 버튼 wrapper
const BackButtonWrapper = styled.div`
  position: absolute;
  left: 23px;
  top: 139px;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
`;

// 뒤로가기 버튼
const BackButton = styled.button`
  width: 100%;
  height: 100%;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  outline: none;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  
  &:focus {
    outline: none;
    box-shadow: none;
  }
  
  &:focus-visible {
    outline: none;
    box-shadow: none;
  }
  
  &:active {
    opacity: 0.8;
    outline: none;
    box-shadow: none;
  }
  
  svg {
    width: 100%;
    height: 100%;
  }
`;

// 뒤로가기 아이콘 컴포넌트 (Chevron Left)
const BackIcon = () => (
  <img 
    src="/assets/Chevron_Left.svg" 
    alt="뒤로가기" 
    width="40" 
    height="40"
  />
);

// 제목
const Title = styled.h1`
  font-family: 'Pretendard', sans-serif;
  font-weight: 600;
  font-size: 24px;
  line-height: 26px;
  color: #cfcfcf;
  margin: 0;
  padding: 0 30px;
  margin-top: 95px;
  margin-bottom: 20px;
  flex-shrink: 0;
`;

// 학교 검색 입력 컨테이너
const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 333px;
  margin: 0 auto;
  margin-top: 7px;
  flex-shrink: 0;
`;

const SearchInputWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 50px;
  background: #585858;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 14px;
  outline: 1px solid ${props => props.$isFocused ? '#2AB7CA' : '#8C8C8C'};
  outline-offset: -1px;
  
  ${props => props.$hasSelection && !props.$isFocused && `
    outline: 1px solid #8C8C8C;
  `}
`;

const SearchInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  font-family: 'Pretendard', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 18px;
  color: ${props => props.$hasValue ? '#ffffff' : '#CFCFCF'};
  outline: none;
  padding: 0;
  
  &::placeholder {
    color: #CFCFCF;
  }
`;

// 검색 아이콘
const SearchIcon = styled.svg`
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  stroke: #cfcfcf;
`;

// 검색 결과 컨테이너
const SearchResults = styled.div`
  width: 100%;
  max-width: 333px;
  margin: 0 auto;
  margin-top: 28px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
`;

// 검색 결과 아이템
const SearchResultItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 5px;
  background: transparent;
  border: none;
  font-family: 'Pretendard', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 18px;
  color: #cfcfcf;
  text-align: left;
  cursor: pointer;
  outline: none;
  min-height: 44px;
  
  &:active {
    opacity: 0.8;
  }
`;

const ResultText = styled.span`
  flex: 1;
`;

// 확대 아이콘
const ExpandIcon = styled.div`
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ExpandIconSvg = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M7 17L17 7M7 7H17V17"
      stroke="#cfcfcf"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// 구분선
const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: rgba(207, 207, 207, 0.2);
  margin-top: 8px;
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

export default function UniversityStep({ currentStep = 2, data, onUpdate, onNext, onBack }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState(data.university || null);
  const [searchResults, setSearchResults] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const { data: universities = [] } = useUniversities();

  // 초기값 설정: data.university가 있으면 검색창에 표시
  useEffect(() => {
    if (data.university) {
      setSelectedUniversity(data.university);
      setSearchQuery(data.university);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 학교 검색
  useEffect(() => {
    // 선택된 학교가 있으면 검색 결과를 표시하지 않음
    if (selectedUniversity) {
      setSearchResults([]);
      return;
    }
    
    if (searchQuery.trim() && universities.length > 0) {
      const filtered = universities
        .filter(uni => uni.name.includes(searchQuery.trim()))
        .slice(0, 10); // 최대 10개만 표시
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, universities, selectedUniversity]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    // 검색창에 직접 입력하면 선택된 학교 초기화
    if (selectedUniversity) {
      setSelectedUniversity(null);
      onUpdate({ university: null });
    }
  };

  const handleSelectUniversity = (university) => {
    setSelectedUniversity(university.name);
    setSearchQuery(university.name);
    onUpdate({ university: university.name });
  };

  const handleNextClick = () => {
    if (selectedUniversity) {
      onNext();
    }
  };

  const isNextDisabled = !selectedUniversity;

  return (
    <Container>
      <ProgressBarWrapper>
        <ProgressBar currentStep={currentStep} totalSteps={4} />
      </ProgressBarWrapper>
      
      <BackButtonWrapper>
        <BackButton onClick={onBack}>
          <BackIcon />
        </BackButton>
      </BackButtonWrapper>

      <Title>학교를 선택해 주세요</Title>

      <SearchContainer>
        <SearchInputWrapper 
          $isFocused={isFocused}
          $hasSelection={!!selectedUniversity}
        >
          <SearchInput
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="학교 검색"
            $hasValue={!!searchQuery}
            autoFocus
          />
          <SearchIcon viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
            <path d="m20 20-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </SearchIcon>
        </SearchInputWrapper>
      </SearchContainer>

      {searchResults.length > 0 && (
        <SearchResults>
          {searchResults.map((university, index) => (
            <div key={university.id}>
              <SearchResultItem
                onClick={() => handleSelectUniversity(university)}
              >
                <ResultText>{university.name}</ResultText>
                <ExpandIcon>
                  <ExpandIconSvg />
                </ExpandIcon>
              </SearchResultItem>
              {index < searchResults.length - 1 && <Divider />}
            </div>
          ))}
        </SearchResults>
      )}

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

