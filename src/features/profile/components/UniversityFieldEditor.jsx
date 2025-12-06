import { useState, useEffect } from 'react';
import styled from 'styled-components';
import useUniversities from '../hooks/useUniversities.js';

const SearchSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 52px 30px 0 30px;
  flex-shrink: 0;
`;

const SearchInputContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 333px;
  margin: 0 auto;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 50px;
  background: #585858;
  border: none;
  border-radius: 10px;
  font-family: 'Pretendard', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 18px;
  color: #ffffff;
  padding: 16px 50px 16px 14px;
  outline: none;
  
  &:focus {
    background: #666666;
  }
  
  &::placeholder {
    color: #9f9f9f;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

const SearchIconSvg = styled.svg`
  width: 100%;
  height: 100%;
  stroke: #cfcfcf;
  fill: none;
`;

const SearchResults = styled.div`
  width: 100%;
  max-width: 333px;
  margin: 0 auto;
  padding-top: 28px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const SearchResultItem = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 5px;
  background: none;
  border: none;
  cursor: pointer;
  outline: none;
  width: 100%;
  min-height: 24px;
  
  &:hover {
    opacity: 0.8;
  }
  
  &:focus,
  &:focus-visible {
    outline: none;
    border: none;
  }
`;

const SearchResultText = styled.span`
  font-family: 'Pretendard', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 18px;
  color: #cfcfcf;
  text-align: left;
`;

const SearchResultIcon = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const SearchResultIconSvg = styled.svg`
  width: 100%;
  height: 100%;
  stroke: #cfcfcf;
  fill: none;
`;

const Underline = styled.div`
  width: 100%;
  height: 1px;
  background: #585858;
  margin-top: 2px;
`;

export default function UniversityFieldEditor({ value, onChange }) {
  const [searchQuery, setSearchQuery] = useState(value || '');
  const [searchResults, setSearchResults] = useState([]);
  const { data: universities = [], error } = useUniversities();

  // 에러 처리
  useEffect(() => {
    if (error) {
      console.error('학교 데이터 로드 실패:', error);
    }
  }, [error]);

  // 초기 검색어 설정 (마운트 시에만)
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    if (!isInitialized && value) {
      setSearchQuery(value);
      setIsInitialized(true);
    }
  }, [value, isInitialized]);

  // 학교 검색
  useEffect(() => {
    if (searchQuery.trim() && universities.length > 0) {
      const filtered = universities.filter(uni =>
        uni.name.includes(searchQuery.trim())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, universities]);

  // 검색어 변경
  const handleSearchChange = (query) => {
    console.log('UniversityFieldEditor - 검색어 변경:', query);
    setSearchQuery(query);
    onChange(query);
  };

  // 학교 선택
  const handleSelectUniversity = (university) => {
    onChange(university.name);
    setSearchQuery(university.name);
    setSearchResults([]);
  };

  return (
    <SearchSection>
      <SearchInputContainer>
        <SearchInput
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="학교를 검색하세요"
          autoFocus
        />
        <SearchIcon>
          <SearchIconSvg viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" strokeWidth="2" />
            <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
          </SearchIconSvg>
        </SearchIcon>
      </SearchInputContainer>

      {searchResults.length > 0 && (
        <SearchResults>
          {searchResults.map((university, index) => (
            <div key={university.id}>
              <SearchResultItem onClick={() => handleSelectUniversity(university)}>
                <SearchResultText>{university.name}</SearchResultText>
                <SearchResultIcon>
                  <SearchResultIconSvg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M7 17L17 7M7 7h10v10"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </SearchResultIconSvg>
                </SearchResultIcon>
              </SearchResultItem>
              {index < searchResults.length - 1 && <Underline />}
            </div>
          ))}
        </SearchResults>
      )}
    </SearchSection>
  );
}

