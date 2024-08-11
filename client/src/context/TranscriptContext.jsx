import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { useVideoPlayer } from "./VideoContext";

const TranscriptContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useTranscript = () => {
  return useContext(TranscriptContext);
};

const fetchTranscript = async (videoId, language) => {
  const url = new URL(`http://localhost:5000/api/get_transcript/${videoId}`);
  if (language) {
    url.searchParams.append("language", language);
  }
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const TranscriptProvider = ({ children, videoId }) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });
  const [copiedText, setCopiedText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const transcriptContainerRef = useRef(null);
  const { currentTime } = useVideoPlayer();
  const {
    data: transcript,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["transcript", videoId, selectedLanguage],
    queryFn: () => fetchTranscript(videoId, selectedLanguage),
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnReconnect: false,
    retry: false,
  });

  const handleMouseUp = useCallback((event) => {
    const selectedText = window.getSelection().toString();
    if (selectedText) {
      const containerRect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - containerRect.left;
      const y = event.clientY - containerRect.top;

      setCopiedText(selectedText);
      setPopoverPosition({ x, y });
      setPopoverOpen(true);
    }
  }, []);

  const handleLanguageChange = useCallback((language) => {
    setSelectedLanguage(language);
  }, []);

  const getCurrentTranscriptIndex = useCallback(() => {
    if (!transcript) return -1;
    return transcript.findIndex((item, index) => {
      const nextItem = transcript[index + 1];
      return (
        currentTime >= Number(item.start) &&
        (!nextItem || currentTime < Number(nextItem.start))
      );
    });
  }, [transcript, currentTime]);

  const scrollToHighlightedText = useCallback(() => {
    const container = transcriptContainerRef.current;
    const currentIndex = getCurrentTranscriptIndex();
    const highlightedElement = container?.querySelector(
      `[data-index="${currentIndex}"]`
    );

    if (container && highlightedElement) {
      const containerRect = container.getBoundingClientRect();
      const highlightedRect = highlightedElement.getBoundingClientRect();

      if (
        highlightedRect.top < containerRect.top ||
        highlightedRect.bottom > containerRect.bottom
      ) {
        highlightedElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [getCurrentTranscriptIndex]);

  useEffect(() => {
    scrollToHighlightedText();
  }, [currentTime, scrollToHighlightedText]);

  const value = {
    transcript,
    isLoading,
    error,
    popoverOpen,
    setPopoverOpen,
    popoverPosition,
    copiedText,
    handleMouseUp,
    getCurrentTranscriptIndex,
    handleLanguageChange,
    transcriptContainerRef,
  };

  return (
    <TranscriptContext.Provider value={value}>
      {children}
    </TranscriptContext.Provider>
  );
};
