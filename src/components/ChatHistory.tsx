import type { ChatMessage } from "../types/chat";
import { ChatMessageItem } from "./ChatMessageItem";
import styles from "./ChatHistory.module.css";
import { useEffect, useRef } from "react";

interface ChatHistoryProps {
  messages: ChatMessage[];
  loading: boolean;
}

export const ChatHistory = ({ messages, loading }: ChatHistoryProps) => {
  const anchorRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    anchorRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);
  return (
    <div
      className={styles.wrapper}
      aria-label="Chat history"
      aria-live="polite"
      aria-busy={loading}
    >
      {messages.length === 0 ? (
        <div className={styles.emptyState}>
          No messages to display. Start the conversation by asking a question or
          making a statement to the AI assistant.
        </div>
      ) : (
        messages.map((message) => (
          <ChatMessageItem key={message.id} message={message} />
        ))
      )}
      {loading && (
        <div className={styles.loadingIndicator} role="status" aria-live="polite">
          <span className={styles.spinner} aria-hidden="true" />
          <span className={styles.loadingText}>Thinking...</span>
        </div>
      )}
      <div ref={anchorRef} />
    </div>
  );
};
