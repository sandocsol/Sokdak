import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import HomePage from "./pages/HomePage.jsx";
import RankingPage from "./pages/RankingPage.jsx";
import ClubPage from "./pages/ClubPage.jsx";
import MyPage from "./pages/MyPage.jsx";
import PraisePage from "./pages/PraisePage.jsx";
import ProfileEditPage from "./pages/ProfileEditPage.jsx";
import ProfileFieldEditPage from "./pages/ProfileFieldEditPage.jsx";
import ClubSearchPage from "./pages/ClubSearchPage.jsx";
import ClubJoinPage from "./pages/ClubJoinPage.jsx";
import ClubCreatePage from "./pages/ClubCreatePage.jsx";
import OnboardingPage from "./pages/OnboardingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NotificationPage from "./pages/NotificationPage.jsx";
import { AuthProvider } from "./features/auth/AuthProvider.jsx";
// 개발 모드에서 세션 쿠키 유틸리티 초기화
import "./lib/sessionUtils.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "ranking",
        element: <RankingPage />,
      },
      {
        path: "club/:clubId",
        element: <ClubPage />,
      },
      {
        path: "club/search",
        element: <ClubSearchPage />,
      },
      {
        path: "club/join/:clubId",
        element: <ClubJoinPage />,
      },
      {
        path: "club/create",
        element: <ClubCreatePage />,
      },
      {
        path: "mypage",
        element: <MyPage />,
      },
      {
        path: "profile/edit",
        element: <ProfileEditPage />,
      },
      {
        path: "profile/edit/:fieldType",
        element: <ProfileFieldEditPage />,
      },
      {
        path: "praise",
        element: <PraisePage />,
      },
      {
        path: "onboarding/:step",
        element: <OnboardingPage />,
      },
      {
        path: "onboarding",
        element: <OnboardingPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "notifications",
        element: <NotificationPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
