import {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";

const VideoPlayerContext = createContext();

export const useVideoPlayer = () => {
  return useContext(VideoPlayerContext);
};

export const VideoPlayerProvider = ({ children }) => {
  const playerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const currentTimeRef = useRef(0);
  const endTimeRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [endTime, setEndTime] = useState(null);

  const handleProgress = useCallback((state) => {
    currentTimeRef.current = state.playedSeconds;
    setCurrentTime(state.playedSeconds);
    if (
      endTimeRef.current !== null &&
      currentTimeRef.current >= endTimeRef.current
    ) {
      if (playerRef.current) {
        playerRef.current.getInternalPlayer().pauseVideo();
        setIsPlaying(false);
        endTimeRef.current = null;
      }
    }
  }, []);

  const seekTo = useCallback((time) => {
    if (playerRef.current) {
      playerRef.current.seekTo(time, "seconds");
      playerRef.current.getInternalPlayer().playVideo();
    }
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const getCurrentTime = useCallback(() => {
    return currentTimeRef.current;
  }, []);

  const setVideoEndTime = useCallback((time) => {
    endTimeRef.current = time;
  }, []);

  useEffect(() => {
    const checkEndTime = () => {
      if (endTime !== null && currentTime >= endTime) {
        if (playerRef.current) {
          playerRef.current.getInternalPlayer().pauseVideo();
          setIsPlaying(false);
          setEndTime(null);
        }
      }
    };

    const intervalId = setInterval(checkEndTime, 100); // Check every 100ms

    return () => clearInterval(intervalId);
  }, [currentTime, endTime]);

  const value = useMemo(
    () => ({
      playerRef,
      isPlaying,
      handleProgress,
      seekTo,
      togglePlay,
      getCurrentTime,
      setVideoEndTime,
      currentTime,
    }),
    [
      isPlaying,
      handleProgress,
      seekTo,
      togglePlay,
      getCurrentTime,
      setVideoEndTime,
      currentTime,
    ]
  );

  return (
    <VideoPlayerContext.Provider value={value}>
      {children}
    </VideoPlayerContext.Provider>
  );
};
