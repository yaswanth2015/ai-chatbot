import { ChatRequestOptions, Message } from 'ai';
import { PreviewMessage, ThinkingMessage } from './message';
import { useScrollToBottom, useSetScrollToBottom } from './use-scroll-to-bottom';
import { Overview } from './overview';
import { memo, useEffect } from 'react';
import { Vote } from '@/lib/db/schema';
import equal from 'fast-deep-equal';
import { ArrowBigDown } from 'lucide-react';
import { ArrowUpIcon } from './icons';
import { Button } from './ui/button';

interface MessagesProps {
  chatId: string;
  isLoading: boolean;
  votes: Array<Vote> | undefined;
  messages: Array<Message>;
  setMessages: (
    messages: Message[] | ((messages: Message[]) => Message[]),
  ) => void;
  reload: (
    chatRequestOptions?: ChatRequestOptions,
  ) => Promise<string | null | undefined>;
  isReadonly: boolean;
  isBlockVisible: boolean;
}

function PureMessages({
  chatId,
  isLoading,
  votes,
  messages,
  setMessages,
  reload,
  isReadonly,
}: MessagesProps) {
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();
  const {isAtBottom , goToBottom} = useSetScrollToBottom(messagesContainerRef)

  return (
    <div
      ref={messagesContainerRef}
      className="flex relative flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4"
    >
      {/* {messages.length === 0 && <Overview />} */}

      {messages.map((message, index) => (
        <PreviewMessage
          key={message.id}
          chatId={chatId}
          message={message}
          isLoading={isLoading && messages.length - 1 === index}
          vote={
            votes
              ? votes.find((vote) => vote.messageId === message.id)
              : undefined
          }
          setMessages={setMessages}
          reload={reload}
          isReadonly={isReadonly}
        />
      ))}

      {isLoading &&
        messages.length > 0 &&
        messages[messages.length - 1].role === 'user' && <ThinkingMessage />}

      <div
        ref={messagesEndRef}
        className="shrink-0 min-w-[24px] min-h-[24px]"
      />
      {isAtBottom ? null : <BottomArrow onClick={()=>{goToBottom()}}/>}
    </div>
  );
}

function BottomArrow({onClick}:{onClick: ()=>void}) {
  return <div className='bottom-2 sticky flex justify-center'>
    <Button onClick={onClick} className='w-[30px] h-[20px] rotate-180 rounded-full p-1.5 h-fit bg-slate-300'>
      <ArrowUpIcon size={20} />
    </Button>
  </div> 
}

export const Messages = memo(PureMessages, (prevProps, nextProps) => {
  if (prevProps.isBlockVisible && nextProps.isBlockVisible) return true;

  if (prevProps.isLoading !== nextProps.isLoading) return false;
  if (prevProps.isLoading && nextProps.isLoading) return false;
  if (prevProps.messages.length !== nextProps.messages.length) return false;
  if (!equal(prevProps.votes, nextProps.votes)) return false;

  return true;
});
