import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import ClubSelector from "../components/ClubSelector/ClubSelector.jsx";
import useSearchClubs from "../features/club/hooks/useSearchClubs.js";

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
  top: 70px;
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
  top: 81px;
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
  position: absolute;
  left: 50%;
  top: 707px;
  transform: translateX(-50%);
  width: 333px;
  height: 50px;
  background: ${(props) => (props.disabled ? "#ffd5d2" : "#2AB7CA")};
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

export default function ClubSearchPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClub, setSelectedClub] = useState(null);
  const { data: clubs, loading, error } = useSearchClubs(searchQuery, true);

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
    // TODO: 동아리 생성 페이지로 이동
    console.log("동아리 생성");
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setSelectedClub(null);
  };

  const handleResultClick = (club) => {
    setSelectedClub(club);
    setSearchQuery(`${club.name} ${club.university}`);
  };

  const handleNext = () => {
    if (selectedClub) {
      navigate(`/club/join/${selectedClub.id}`);
    }
  };

  const isNextButtonDisabled = !selectedClub;

  if (loading) {
    return (
      <Container>
        <BackButton onClick={handleBack}>
          <img src="/assets/Chevron_Left.svg" alt="뒤로 가기" />
        </BackButton>
        <CreateClubText onClick={handleCreateClub}>동아리 생성</CreateClubText>
        <Title>동아리를 선택해 주세요</Title>
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="로딩 중..."
            disabled
          />
        </SearchContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <BackButton onClick={handleBack}>
          <img src="/assets/Chevron_Left.svg" alt="뒤로 가기" />
        </BackButton>
        <CreateClubText onClick={handleCreateClub}>동아리 생성</CreateClubText>
        <Title>동아리를 선택해 주세요</Title>
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="데이터를 불러올 수 없습니다."
            disabled
          />
        </SearchContainer>
      </Container>
    );
  }

  return (
    <Container>
      <BackButton onClick={handleBack}>
        <img src="/assets/Chevron_Left.svg" alt="뒤로 가기" />
      </BackButton>
      
      <CreateClubText onClick={handleCreateClub}>동아리 생성</CreateClubText>
      
      <Title>동아리를 선택해 주세요</Title>
      
      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="동아리 이름 검색"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <SearchIcon>
          <SearchIconSvg />
        </SearchIcon>
      </SearchContainer>
      
      {searchResults.length > 0 && (
        <SearchResultsContainer>
          {searchResults.map((club, index) => (
            <div key={club.id}>
              <SearchResult onClick={() => handleResultClick(club)}>
                <SearchResultText>
                  {club.name} {club.university}
                </SearchResultText>
                <ArrowIcon>
                  <ArrowUpLeftIcon />
                </ArrowIcon>
              </SearchResult>
              {index < searchResults.length - 1 && <Divider />}
            </div>
          ))}
        </SearchResultsContainer>
      )}
      
      <NextButton disabled={isNextButtonDisabled} onClick={handleNext}>
        다음으로
      </NextButton>
    </Container>
  );
}

