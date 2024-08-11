import { createContext, useContext, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useVideoPlayer } from "./VideoContext";

const EpisodesContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useEpisodes = () => {
  return useContext(EpisodesContext);
};

const fetchEpisodes = async (videoId, language) => {
  const url = new URL(
    `http://localhost:5000/api/transcript_to_episodes/${videoId}`
  );
  if (language) {
    url.searchParams.append("language", language);
  }
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const EpisodesProvider = ({ children, videoId }) => {
  const episodesContainerRef = useRef(null);
  // const { currentTime } = useVideoPlayer();s
  const {
    data: episodes,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["episodes", videoId],
    queryFn: () => fetchEpisodes(videoId),
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnReconnect: false,
    retry: false,
  });

  const value = {
    episodes,
    isLoading,
    error,
    episodesContainerRef,
  };

  return (
    <EpisodesContext.Provider value={value}>
      {children}
    </EpisodesContext.Provider>
  );
};
