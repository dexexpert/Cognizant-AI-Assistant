import type { ChatMessage } from "../types/chat";

interface ChatMessageItemProps {
  message: ChatMessage;
}

export const ChatMessageItem = ({ message }: ChatMessageItemProps) => {
  return <div className="chat-message-item">{message.content}</div>;
};
