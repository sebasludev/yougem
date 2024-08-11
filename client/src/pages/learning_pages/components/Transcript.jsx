import { useTranscript } from "../../../context/TranscriptContext";
import { useVideoPlayer } from "../../../context/VideoContext";
import { PopoverComponent } from "./Popover";
import AnimatedCircles from "../../../components/icons/loading2";
import { useEffect } from "react";

export const Transcript = ({ setIsChatOpen }) => {
  const {
    transcript,
    isLoading,
    error,
    handleMouseUp,
    getCurrentTranscriptIndex,
    transcriptContainerRef,
  } = useTranscript();
  const { currentTime } = useVideoPlayer();

  useEffect(() => {
    const currentIndex = getCurrentTranscriptIndex();
    const highlightedElement = transcriptContainerRef.current?.querySelector(
      `[data-index="${currentIndex}"]`
    );

    if (highlightedElement) {
      highlightedElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentTime, getCurrentTranscriptIndex, transcriptContainerRef]);

  if (isLoading)
    return (
      <div>
        <AnimatedCircles />
      </div>
    );
  if (error) return <div>No transcript available{error.message}</div>;

  const currentIndex = getCurrentTranscriptIndex();

  return (
    <div
      ref={transcriptContainerRef}
      className='relative w-full px-5 py-5  overflow-y-auto'
    >
      <div onMouseUp={handleMouseUp} className='space-y-3'>
        {transcript &&
          transcript.map((item, index) => (
            <div
              key={index}
              data-index={index}
              // onClick={() => seekTo(item.start)}
            >
              <p
                className={`font-normal leading-10  ${
                  index === currentIndex
                    ? " text-white font-bold border-2 border-white px-5 py-6  cursor-none"
                    : "  px-5 text-gray-400"
                }`}
              >
                {item.text}
              </p>
            </div>
          ))}
      </div>
      <PopoverComponent setIsChatOpen={setIsChatOpen} />
    </div>
  );
};
