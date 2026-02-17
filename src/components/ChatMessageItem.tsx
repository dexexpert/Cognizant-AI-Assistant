import type { ChatMessage } from "../types/chat";
import styles from "./ChatMessageItem.module.css";

interface ChatMessageItemProps {
  message: ChatMessage;
}

export const ChatMessageItem = ({ message }: ChatMessageItemProps) => {
  const isUser = message.sender === "user";
  return (
    <div
      className={`${styles.row} ${isUser ? styles.userRow : styles.assistantRow}`}
    >
      <div className={styles.inner}>
        <div
          className={`${styles.bubble} ${isUser ? styles.user : styles.assistant}`}
        >
          <p className={styles.content}>{message.content}</p>
        </div>
      </div>
    </div>
  );
};
