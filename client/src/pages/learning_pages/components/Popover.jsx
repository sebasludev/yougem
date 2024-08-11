import * as Popover from "@radix-ui/react-popover";
import { useChatContext } from "../../../context/ChatContext";
import { useTranscript } from "../../../context/TranscriptContext";
import { TextInput } from "../../../components/shared/chat/TextInput";

export const PopoverComponent = ({ setIsChatOpen }) => {
  const { handleChange, handleSubmit, inputText } = useChatContext();
  const { popoverOpen, setPopoverOpen, popoverPosition, copiedText } =
    useTranscript();

  const handlePopoverClose = (e) => {
    handleSubmit(e, copiedText);
    setPopoverOpen(false);
    setIsChatOpen(true);
  };

  return (
    <Popover.Root open={popoverOpen} onOpenChange={setPopoverOpen}>
      <Popover.Anchor
        className='absolute'
        style={{
          left: popoverPosition.x,
          top: popoverPosition.y,
        }}
      />
      <Popover.Content
        className='bg-black text-white px-5 py-3 rounded-md space-y-0 shadow-lg border border-white w-[400px]'
        sideOffset={5}
      >
        <div>
          <span className='text-white font-medium text-lg'>{copiedText}</span>
        </div>
        <div className='flex flex-col'>
          <TextInput
            handleChange={handleChange}
            handleSubmit={handlePopoverClose}
            value={inputText}
          />
        </div>
      </Popover.Content>
    </Popover.Root>
  );
};
