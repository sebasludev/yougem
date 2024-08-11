import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import HomePage from "./pages/home_page/index.jsx";
import RoadmapOutlinePage from "./pages/roadmap_outline_page/index.jsx";
import LearnSearchResultsPage from "./pages/learn_search_results_page/index.jsx";
import LearnLayoutWithSidebar from "./pages/roadmap_outline_page/Layout.jsx";
import LearningLayout from "./pages/learning_pages/layouts/LearningLayout.jsx";
import WatchVideoPage from "./pages/learning_pages/WatchVideo.jsx";
import ChatComponentV2 from "./components/chat_component/index.jsx";
import SearchPage from "./pages/search_pages/index.jsx";
import WatchVideoAndChatPage from "./pages/watch_and_chat_page/index.jsx";
import GlobalLayout from "./pages/GlobalLayout.jsx";
import SearchPageLayout from "./pages/search_pages/layout/index.jsx";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <GlobalLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/search",
        element: <SearchPageLayout />,
        children: [
          {
            index: true,
            element: <SearchPage />,
          },
        ],
      },
      {
        path: "/watch",
        element: <WatchVideoAndChatPage />,
      },
      {
        path: "/chat",
        element: <ChatComponentV2 />,
      },
      {
        path: "learn",
        element: <LearnLayoutWithSidebar />,
        children: [
          {
            index: true,
            element: <RoadmapOutlinePage />,
          },
          {
            path: "/learn/:level/:subject",
            element: <LearnSearchResultsPage />,
          },
        ],
      },
      {
        path: "/learn/:level/:subject/video/:videoTitle/:id",
        element: <LearningLayout />,
        children: [
          {
            index: true,
            element: <WatchVideoPage />,
          },
        ],
      },
    ],
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
