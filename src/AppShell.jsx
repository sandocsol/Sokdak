import { useLocation } from "react-router-dom";
import styled from "styled-components";
import BottomNav from "./components/BottomNav.jsx";

const Page = styled.div`
  width: 100vw;
  height: 100dvh; /* 데스크톱/모바일 모두 가득 */
  display: grid;
  place-items: center;
  background: #222222;
  overflow: hidden;
`;

/* 폰 화면 (iPhone 390×844 비율 유지) */
const PhoneFrame = styled.div`
  /* 핵심: 한쪽만 지정 + aspect-ratio 로 다른 축을 자동 계산 */
  aspect-ratio: 393 / 844;

  /* 세로를 기준으로 채우되, 가로를 넘치지 않도록 클램프 */
  width: min(100vw, calc(100dvh * (393 / 844)));
  /* height는 aspect-ratio에 따라 자동 계산됨 */

  background: #222222;
  overflow: hidden;
  position: relative; /* 내부 absolute 기준 */
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  /* 모바일에선 진짜 풀화면으로 쓰고 싶다면 이 분기 사용 */
  @media (max-width: 768px) {
    width: 100vw;
    height: 100vh; /* 폴백 */
    height: 100dvh; /* 주소창 변화 대응 */
    border-radius: 0;
    box-shadow: none;
    /* iOS 안전영역 */
    padding: max(0px, env(safe-area-inset-top))
      max(0px, env(safe-area-inset-right)) max(0px, env(safe-area-inset-bottom))
      max(0px, env(safe-area-inset-left));
  }
`;

const ContentWrapper = styled.div`
  flex: 1;
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 100%;
`;

export default function AppShell({ children }) {
  const location = useLocation();
  const showBottomNav = 
    location.pathname !== "/praise" && 
    location.pathname !== "/club/search" &&
    location.pathname !== "/onboarding" &&
    location.pathname !== "/login" &&
    !location.pathname.startsWith("/profile/edit") &&
    !location.pathname.startsWith("/club/join");

  return (
    <Page>
      <PhoneFrame data-phone-frame="true">
        <ContentWrapper>{children}</ContentWrapper>
        {showBottomNav && <BottomNav />}
      </PhoneFrame>
    </Page>
  );
}
