import * as Dialog from "@radix-ui/react-dialog";
import { useChatContext } from "../../context/ChatContext";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import AnimatedSVG from "../icons/loading";
import { useVideoPlayer } from "../../context/VideoContext";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";

const fetchData = async (data) => {
  const response = await fetch("http://localhost:5000/api/chat-summurize", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

const ChatIndex = ({ onSelect, isStreaming }) => {
  const { conversation } = useChatContext();
  const shouldFetch = useRef(true);
  const { seekTo } = useVideoPlayer();

  const { data, isLoading, error } = useQuery({
    queryKey: ["chatIndexData", conversation],
    queryFn: () => fetchData(conversation),
    enabled: shouldFetch.current && conversation.length > 0 && !isStreaming,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnReconnect: false,
    retry: false,
  });

  useEffect(() => {
    return () => {
      shouldFetch.current = false;
    };
  }, []);

  const handleClick = (index, time) => {
    seekTo(time);
    onSelect(index);
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className=' border-2 bg-black border-white w-10 h-10 rounded-full flex justify-center items-center hover:bg-red-500'>
          <HamburgerMenuIcon className='w-5 h-5' />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className='fixed inset-0 bg-black/50' />
        <Dialog.Content className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black border-2 border-blue-100 rounded-lg p-6 w-[90vw] max-w-[550px] max-h-[85vh] overflow-y-auto text-white'>
          <Dialog.Title className='text-xl font-bold mb-5'>
            History
          </Dialog.Title>
          <div className='flex flex-col space-y-10 '>
            {isLoading ? (
              <AnimatedSVG />
            ) : JSON.parse(data["received_data"]).length > 0 ? (
              JSON.parse(data["received_data"]).map((piece, index) => (
                <Dialog.Close asChild key={index}>
                  <button
                    className='border-2 border-blue-100 px-10 py-8 group  rounded-md text-start hover:bg-red-500'
                    onClick={() => handleClick(index, piece.time)}
                  >
                    <div className='space-y-5'>
                      <div className='mb-2'>
                        <h6 className='font-bold text-sm text-red-300 group-hover:text-black'>
                          Your Prompt
                        </h6>
                        <p className='text-start text-lg'>{piece.user_text}</p>
                      </div>
                      <div className='mb-2 '>
                        <h6 className='font-bold text-sm text-red-300 group-hover:text-black'>
                          Summerized Answer
                        </h6>
                        <p className='text-start text-lg'>{piece.summury}</p>
                      </div>
                    </div>
                  </button>
                </Dialog.Close>
              ))
            ) : (
              "You did not started a conversation yet"
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ChatIndex;
