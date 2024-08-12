import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactPlayer from "react-player/youtube";
import {
  VideoPlayerProvider,
  useVideoPlayer,
} from "../../context/VideoContext";
import { TranscriptProvider } from "../../context/TranscriptContext";
import { ChatProvider } from "../../context/ChatContext";
import ChatComponent from "../../components/chat_component";
import { Transcript } from "./components/Transcript";
import { streamGemini } from "../../api/gemini";
import { useLocalStorage } from "@uidotdev/usehooks";

function removeEndPunctuation(str) {
  const punctuationRegex = /[.,;:!?]/; // Adjust as needed
  return str.replace(punctuationRegex, "").trim();
}

function VideoPlayer() {
  const { playerRef, handleProgress, isPlaying, togglePlay } = useVideoPlayer();
  const { id } = useParams();

  return (
    <div className='aspect-video  overflow-hidden'>
      <ReactPlayer
        ref={playerRef}
        url={`https://www.youtube.com/watch?v=${id}`}
        width='100%'
        height='100%'
        controls={true}
        playing={isPlaying}
        onProgress={handleProgress}
        onPause={togglePlay}
        onPlay={togglePlay}
      />
    </div>
  );
}

function TranscriptChat() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { subject, level, videoTitle, id } = useParams();
  const [data] = useLocalStorage("navbar");

  return (
    <div className='flex-grow w-[33%] flex flex-col   border-2 border-white'>
      <nav className='flex space-x-5 px-5 py-5 text-white'>
        <Button
          text='Transcript'
          isChatOpen={isChatOpen}
          onClick={() => setIsChatOpen(false)}
        />

        <Button
          text='Chat'
          isChatOpen={isChatOpen}
          onClick={() => setIsChatOpen(true)}
        />
      </nav>
      <div className=' overflow-y-auto h-full'>
        <ChatProvider
          chatId={`${removeEndPunctuation(videoTitle)}-${id}`}
          video_id={id}
          initialHistory={[]}
          initialConversation={[]}
          streamFunction={streamGemini}
          system_instruction={`
            You are a supportive and empathetic teacher, your student is **${
              JSON.parse(data).prompt
            }**. The student is watching a video with the title: **${removeEndPunctuation(
            videoTitle
          )}`}
          model='gemini-1.5-flash'
        >
          {isChatOpen ? (
            <ChatComponent />
          ) : (
            <Transcript setIsChatOpen={setIsChatOpen} />
          )}
        </ChatProvider>
      </div>
    </div>
  );
}

function WatchVideoPageContent() {
  const navigate = useNavigate();

  const handleClick = (event) => {
    event.preventDefault();
    navigate(-1);
  };
  return (
    <div className='flex h-full py-10 px-5 space-x-10 w-full '>
      <div className='flex-grow flex-shrink-0 w-[67%] flex flex-col justify-between'>
        <VideoPlayer />
        <button onClick={handleClick} className='text-white font-bold  w-fit'>
          Back
        </button>
      </div>
      <TranscriptChat />
    </div>
  );
}

function WatchVideoPage() {
  const { id } = useParams();

  return (
    <VideoPlayerProvider>
      <TranscriptProvider videoId={id}>
        <WatchVideoPageContent />
      </TranscriptProvider>
    </VideoPlayerProvider>
  );
}

export default WatchVideoPage;

const Button = ({ text, onClick, isChatOpen }) => {
  return (
    <button
      className={`${
        isChatOpen && text === "Chat"
          ? "border-2 border-red-500 text-white px-6 py-2  font-bold"
          : !isChatOpen &&
            text === "Transcript" &&
            "border-2 border-red-500 text-white px-6 py-2  font-bolds"
      }`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};
