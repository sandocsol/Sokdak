import { useState, useMemo, useRef, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import ClubSelector from "../components/ClubSelector/ClubSelector.jsx";
import useSearchClubs from "../features/club/hooks/useSearchClubs.js";

const Container = styled.div`
  width: 100%;
  height: 100vh;
  min-height: 100vh;
  background: #222222;
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: 100px;
  box-sizing: border-box;
`;

const BackButton = styled.button`
  position: absolute;
  left: 23px;
  top: 30px;
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

const CreateClubText = styled.p`
  position: absolute;
  right: 30px;
  top: 30px;
  font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 18px;
  color: #cfcfcf;
  margin: 0;
  cursor: pointer;
  
  &:hover {
    opacity: 0.8;
  }
  
  &:active {
    opacity: 0.6;
  }
`;

const Title = styled.p`
  font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-weight: 600;
  font-size: 24px;
  line-height: 26px;
  color: #cfcfcf;
  margin: 0;
  position: absolute;
  left: 30px;
  top: 133px;
  width: 250px;
  text-align: left;
`;

const SearchContainer = styled.div`
  position: absolute;
  left: 50%;
  top: 186px;
  transform: translateX(-50%);
  width: 333px;
  height: 50px;
  background: #585858;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 14px;
  box-sizing: border-box;
`;

const SearchInput = styled.input`
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

const SearchResultsContainer = styled.div`
  position: absolute;
  left: 50%;
  top: 264px;
  transform: translateX(-50%);
  width: 333px;
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const SearchResult = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 5px 6px 5px;
  box-sizing: border-box;
  cursor: pointer;
  
  &:hover {
    opacity: 0.8;
  }
  
  &:active {
    opacity: 0.6;
  }
`;

const SearchResultText = styled.p`
  font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 18px;
  color: #cfcfcf;
  margin: 0;
  flex: 1;
  text-align: left;
`;

const ArrowIcon = styled.div`
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

const ArrowUpLeftIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M7 17L17 7M7 7H17V17"
      stroke="#cfcfcf"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Divider = styled.div`
  width: 330px;
  height: 1px;
  background: #cfcfcf;
  opacity: 0.3;
  margin: 0 auto;
`;

const NextButton = styled.button`
  position: fixed;
  left: 50%;
  bottom: 30px;
  transform: translateX(-50%);
  width: 333px;
  max-width: calc(100vw - 40px);
  height: 50px;
  background: ${(props) => (props.disabled ? "#B9D0D3" : "#2AB7CA")};
  border: none;
  border-radius: 10px;
  padding: 11px 77px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  z-index: 1000;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.3);
  
  font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 18px;
  color: white;
  text-align: center;
  white-space: nowrap;
  
  @media (max-height: 700px) {
    bottom: 20px;
  }
  
  @media (max-height: 600px) {
    bottom: 10px;
  }
  
  &:hover {
    opacity: ${(props) => (props.disabled ? 1 : 0.9)};
  }
  
  &:active {
    opacity: ${(props) => (props.disabled ? 1 : 0.8)};
  }
`;

export default function ClubSearchPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClub, setSelectedClub] = useState(null);
  const searchInputRef = useRef(null);
  const wasFocusedRef = useRef(false);
  const cursorPositionRef = useRef(0);
  const { data: clubs, loading, error } = useSearchClubs(searchQuery, true);

  // 입력 필드 포커스 유지 (동기적으로 실행)
  useLayoutEffect(() => {
    const input = searchInputRef.current;
    if (input) {
      if (document.activeElement === input) {
        wasFocusedRef.current = true;
        cursorPositionRef.current = input.selectionStart || 0;
      } else if (wasFocusedRef.current) {
        // 포커스가 있었는데 사라진 경우 복원
        input.focus();
        input.setSelectionRange(cursorPositionRef.current, cursorPositionRef.current);
      }
    }
  });

  // 검색 결과는 최대 4개만 표시
  const searchResults = useMemo(() => {
    if (!clubs || clubs.length === 0) {
      return [];
    }
    return clubs.slice(0, 4);
  }, [clubs]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleCreateClub = () => {
    navigate("/club/create");
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setSelectedClub(null);
    // 커서 위치 저장
    if (searchInputRef.current) {
      cursorPositionRef.current = searchInputRef.current.selectionStart || value.length;
    }
  };

  const handleResultClick = (club) => {
    setSelectedClub(club);
    // setSearchQuery(`${club.name} ${club.university}`);
    setSearchQuery(club.name);
  };

  const handleNext = () => {
    if (selectedClub) {
      // id 또는 clubId 필드 지원
      const clubId = selectedClub.id ?? selectedClub.clubId;
      if (clubId) {
        navigate(`/club/join/${clubId}`);
      }
    }
  };

  const isNextButtonDisabled = !selectedClub;

  return (
    <Container>
      <BackButton onClick={handleBack}>
        <img src="/assets/Chevron_Left.svg" alt="뒤로 가기" />
      </BackButton>
      
      <CreateClubText onClick={handleCreateClub}>동아리 생성</CreateClubText>
      
      <Title>동아리를 선택해 주세요</Title>
      
      <SearchContainer>
        <SearchInput
          ref={searchInputRef}
          type="text"
          placeholder={loading ? "검색 중..." : error ? "검색 오류" : "동아리 이름 검색"}
          value={searchQuery || ""}
          onChange={handleSearchChange}
          disabled={loading && !searchQuery}
        />
        <SearchIcon>
          <SearchIconSvg />
        </SearchIcon>
      </SearchContainer>
      
      {loading && searchQuery && (
        <SearchResultsContainer>
          <SearchResult style={{ cursor: "default", opacity: 0.6 }}>
            <SearchResultText>검색 중...</SearchResultText>
          </SearchResult>
        </SearchResultsContainer>
      )}
      
      {error && searchQuery && (
        <SearchResultsContainer>
          <SearchResult style={{ cursor: "default", opacity: 0.6 }}>
            <SearchResultText>검색 중 오류가 발생했습니다.</SearchResultText>
          </SearchResult>
        </SearchResultsContainer>
      )}
      
      {!loading && !error && searchResults.length > 0 && (
        <SearchResultsContainer>
          {searchResults.map((club, index) => {
            const clubId = club.id ?? club.clubId;
            return (
              <div key={clubId}>
                <SearchResult onClick={() => handleResultClick(club)}>
                  <SearchResultText>
                    {/* {club.name} {club.university} */}
                    {club.name}
                  </SearchResultText>
                  <ArrowIcon>
                    <ArrowUpLeftIcon />
                  </ArrowIcon>
                </SearchResult>
                {index < searchResults.length - 1 && <Divider />}
              </div>
            );
          })}
        </SearchResultsContainer>
      )}
      
      <NextButton disabled={isNextButtonDisabled} onClick={handleNext}>
        다음으로
      </NextButton>
    </Container>
  );
}

