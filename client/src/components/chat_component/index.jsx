import { useRef, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { useChatContext } from "../../context/ChatContext";
import rehypeRaw from "rehype-raw";

import { TextInput } from "../shared/chat/TextInput";
import ChatIndex from "../dialog/Dialog";
import ChatTalking from "../chat_talk/ChatTalking";

const ChatComponent = () => {
  const {
    conversation,
    currentQuestion,
    inputText,
    isStreaming,
    modelAnswer,
    handleChange,
    handleSubmit,
  } = useChatContext();

  const chatEndRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const prevModelAnswer = useRef("");
  const prevCurrentQuestion = useRef("");

  const scrollToBottom = (smooth = false) => {
    chatEndRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    });
  };

  useEffect(() => {
    const isModelAnswerChanged = modelAnswer !== prevModelAnswer.current;
    const isCurrentQuestionChanged =
      currentQuestion !== prevCurrentQuestion.current;

    scrollToBottom(isModelAnswerChanged || isCurrentQuestionChanged);

    prevModelAnswer.current = modelAnswer;
    prevCurrentQuestion.current = currentQuestion;
  }, [modelAnswer, currentQuestion]);

  const scrollToMessage = (index) => {
    const messageElement = document.getElementById(`message-${index}`);
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    if (selectedIndex !== null) {
      scrollToMessage(selectedIndex);
    }
  }, [selectedIndex]);

  return (
    <div className='flex flex-col justify-center items-center w-full h-full   text-white  pb-5 px-5   relative'>
      <div className='flex justify-end w-full absolute top-0 right-10 z-50 '>
        {conversation.length > 0 && !isStreaming ? (
          <ChatIndex onSelect={setSelectedIndex} isStreaming={isStreaming} />
        ) : (
          conversation.length >= 0 && isStreaming && <ChatTalking />
        )}
      </div>
      <div className='overflow-y-auto flex-grow w-full'>
        {conversation.length <= 0 && !isStreaming ? (
          <div className='flex flex-col items-center justify-center h-full'>
            <p>Start chatting about the video</p>
          </div>
        ) : (
          <div className='flex flex-col space-y-10  h-full'>
            {conversation.map((piece, index) => (
              <div
                key={index}
                id={`message-${index}`}
                className='flex flex-col space-y-3'
              >
                <p className='font-bold text-lg text-red-400 '>
                  {piece.user.parts[0].text}
                </p>
                <ReactMarkdown
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    inlineCode: ({ node, ...props }) => (
                      <code
                        className='text-red-500 bg-slate-500 py-1 px-1 rounded-md'
                        {...props}
                      />
                    ),
                  }}
                >
                  {piece.model.parts[0].text}
                </ReactMarkdown>
              </div>
            ))}

            {isStreaming && (
              <div className='flex flex-col space-y-3'>
                <p className='font-bold text-lg text-red-400'>
                  {currentQuestion}
                </p>
                <ReactMarkdown
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    inlineCode: ({ node, ...props }) => (
                      <code
                        style={{
                          backgroundColor: "#f0f0f0",
                          padding: "2px 4px",
                          borderRadius: "4px",
                        }}
                        {...props}
                      />
                    ),
                  }}
                >
                  {modelAnswer.parts[0].text}
                </ReactMarkdown>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      <TextInput
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        value={inputText}
      />
    </div>
  );
};

export default ChatComponent;
