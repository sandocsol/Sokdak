import { Outlet } from "react-router-dom";
import AppShell from "./AppShell.jsx";
import { createGlobalStyle } from "styled-components";

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

  /* 모든 버튼에서 파란색 박스 제거 */
  button {
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
      outline: none;
      box-shadow: none;
    }
  }
`;

function App() {
  return (
    <AppShell>
      <GlobalStyle />
      <Outlet />
    </AppShell>
  );
}

export default App;
