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
import ClubSearch from "./features/club/components/ClubSearch.jsx";

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
        path: "club",
        element: <ClubPage />,
      },
      {
        path: "club/search",
        element: <ClubSearch />,
      },
      {
        path: "mypage",
        element: <MyPage />,
      },
      {
        path: "praise",
        element: <PraisePage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
