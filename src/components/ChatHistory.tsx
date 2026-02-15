import type { ChatMessage } from "../types/chat";
import { ChatMessageItem } from "./ChatMessageItem";
import styles from "./ChatHistory.module.css";

interface ChatHistoryProps {
  messages: ChatMessage[];
  loading: boolean;
}

export const ChatHistory = ({ messages, loading }: ChatHistoryProps) => {
  return (
    <div className="chat-history">
      {/* Chat messages will be rendered here */}
      {messages.map((message) => (
        <ChatMessageItem key={message.id} message={message} />
      ))}
      {loading && <div className={styles.loadingIndicator}>Thinking...</div>}
    </div>
  );
};
