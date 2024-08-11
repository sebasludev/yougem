/* eslint-disable react/display-name */
import React, { useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import ReactPlayer from "react-player/youtube";

import {
  useVideoPlayer,
  VideoPlayerProvider,
} from "../../context/VideoContext";

import { ChatProvider } from "../../context/ChatContext";
import ChatComponent from "../../components/chat_component";

import { EpisodesProvider } from "../../context/EpisodesContext";
import { Episodes } from "../search_pages/components/Episodes";
import { streamGeminiTwo } from "../../api/gemini_two";

function removeEndPunctuation(str) {
  const punctuationRegex = /[.,;:!?]/; // Adjust as needed
  return str.replace(punctuationRegex, "").trim();
}

const VideoPlayer = React.memo(() => {
  const { playerRef, handleProgress, togglePlay } = useVideoPlayer();
  const [searchParams] = useSearchParams();
  const [id, setId] = useState(searchParams.get("v"));

  return (
    <div className='aspect-video  overflow-hidden'>
      <ReactPlayer
        ref={playerRef}
        url={`https://www.youtube.com/watch?v=${id}`}
        width='100%'
        height='100%'
        controls={true}
        onProgress={handleProgress}
        onPause={togglePlay}
        onPlay={togglePlay}
      />
    </div>
  );
});

function TranscriptChat() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  let [searchParams] = useSearchParams();
  let [id, setId] = useState(searchParams.get("v"));
  const location = useLocation();
  const state = location.state;

  return (
    <div
      className={`flex-grow w-[33%] flex flex-col  text-white  border-2  border-white `}
    >
      <nav className='flex space-x-5 px-10 py-5'>
        <Button
          text='Episodes'
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
          chatId={`transcript-chat-${id}`}
          initialHistory={[]}
          initialConversation={[]}
          streamFunction={streamGeminiTwo}
          video_id={id}
          system_instruction={`
            You are a supportive and empathetic guide, you are intercating with some that is watching a video with the title: **${removeEndPunctuation(
              state
            )}
            `}
          model='gemini-1.5-flash'
        >
          {isChatOpen ? (
            <ChatComponent />
          ) : (
            <Episodes setIsChatOpen={setIsChatOpen} />
          )}
        </ChatProvider>
      </div>
    </div>
  );
}
function WatchVideoPageContent() {
  return (
    <div className='flex h-screen py-10 px-5 space-x-10 w-full '>
      <div className='flex-grow flex-shrink-0 w-[67%]'>
        <VideoPlayer />
      </div>
      <TranscriptChat />
    </div>
  );
}

function WatchVideoAndChatPage() {
  let [searchParams] = useSearchParams();
  let [id, setId] = useState(searchParams.get("v"));

  return (
    <VideoPlayerProvider>
      <EpisodesProvider videoId={id}>
        <WatchVideoPageContent />
      </EpisodesProvider>
    </VideoPlayerProvider>
  );
}

export default WatchVideoAndChatPage;

const Button = ({ text, onClick, isChatOpen }) => {
  return (
    <button
      className={`${
        isChatOpen && text === "Chat"
          ? "border-2 border-red-500 text-red-500 px-6 py-2  font-bold"
          : !isChatOpen &&
            text === "Episodes" &&
            "border-2 border-red-500 text-red-500 px-6 py-2  font-bolds"
      }`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};
