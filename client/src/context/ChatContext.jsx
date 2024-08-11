/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from "react";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useVideoPlayer } from "./VideoContext";

const ChatContext = createContext();

export const ChatProvider = ({
  children,
  chatId,
  initialHistory = [],
  initialConversation = [],
  streamFunction,
  model = "gemini-1.5-flash",
  system_instruction,
  video_id = "",
}) => {
  const [history, setHistory] = useLocalStorage(
    `chatHistory_${chatId}`,
    initialHistory
  );
  const [conversation, setConversation] = useLocalStorage(
    `chatConversation_${chatId}`,
    initialConversation
  );
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [inputText, setInputText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [modelAnswer, setModelAnswer] = useState({
    role: "model",
    parts: [{ text: "" }],
  });
  const { currentTime } = useVideoPlayer();

  const changeModelAnswer = useCallback((newAnswer = "") => {
    setModelAnswer((prev) => ({ ...prev, parts: [{ text: newAnswer }] }));
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
    setInputText(capitalizedValue);
  };

  const handleSubmit = async (e, additionalText = "") => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const combinedText = `${inputText}${
      additionalText ? " " + additionalText : ""
    }`.trim();
    if (!combinedText) return;

    setInputText("");
    setIsStreaming(false);
    setCurrentQuestion(combinedText);

    const userPrompt = { role: "user", parts: [{ text: combinedText }] };

    let output = "";

    try {
      const stream = streamFunction({
        contents: [...history, userPrompt],
        model: model,
        system_instruction: system_instruction,
        video_id: video_id,
      });

      setIsStreaming(true);
      for await (let chunk of stream) {
        output += chunk;
        changeModelAnswer(output);
      }
    } catch (error) {
      console.error("Error in chat stream:", error);
      changeModelAnswer("An error occurred while processing your request.");
    } finally {
      setIsStreaming(false);
      setConversation((prev) => [
        ...prev,
        {
          user: userPrompt,
          model: { role: "model", parts: [{ text: output }] },
          time: currentTime,
        },
      ]);
      setHistory((prev) => [
        ...prev,
        userPrompt,
        { role: "model", parts: [{ text: output }] },
      ]);
      changeModelAnswer("");
    }
  };

  const value = {
    history,
    conversation,
    currentQuestion,
    inputText,
    isStreaming,
    modelAnswer,
    handleChange,
    handleSubmit,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
