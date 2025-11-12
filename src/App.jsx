import { Outlet } from "react-router-dom";
import AppShell from "./AppShell.jsx";
import { createGlobalStyle } from "styled-components";
// TODO: useProfile hook이 구현되면 아래 주석을 해제하고 사용하세요
// import useProfile from "./features/profile/hooks/useProfile.js";

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
      "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
`;

function App() {
  // TODO: useProfile hook이 구현되면 아래 주석을 해제하고 사용하세요
  // const { userProfile, loading } = useProfile();
  const userProfile = null;
  const loading = false;

  return (
    <AppShell>
      <GlobalStyle />
      <Outlet context={{ userProfile, isUserProfileLoading: loading }} />
    </AppShell>
  );
}

export default App;
