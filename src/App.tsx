import { useEffect, useRef, useState } from "react";
import styles from "./App.module.css";
import { ChatHistory } from "./components/ChatHistory";
import { PromptInput } from "./components/PromptInput";
import { useChat } from "./hooks/useChat";

function App() {
  const { messages, loading, error, submitPrompt, clearConversation } =
    useChat();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const cancelButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isConfirmOpen) return;
    cancelButtonRef.current?.focus();

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsConfirmOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isConfirmOpen]);

  const handleConfirmClear = () => {
    clearConversation();
    setIsConfirmOpen(false);
  };

  return (
    <div className={styles.main}>
      <section className={styles.panel} aria-label="AI Assistant app">
        <header className={styles.header}>
          <h1 className={styles.title}>Cognizant AI Assistant</h1>
          <button
            type="button"
            className={styles.clearButton}
            disabled={messages.length === 0}
            onClick={() => setIsConfirmOpen(true)}
          >
            Clear Chat
          </button>
        </header>

        <ChatHistory messages={messages} loading={loading} />

        {error ? (
          <div role="alert" className={styles.error}>
            {error}
          </div>
        ) : null}

        <PromptInput
          loading={loading}
          hasError={!!error}
          onSubmit={submitPrompt}
        />
      </section>

      {isConfirmOpen && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setIsConfirmOpen(false)}
          role="presentation"
        >
          <div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="clear-chat-title"
            aria-describedby="clear-chat-description"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="clear-chat-title" className={styles.modalTitle}>
              Clear chat history?
            </h2>
            <p id="clear-chat-description" className={styles.modalDescription}>
              This will permanently remove all messages from this browser.
            </p>
            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.modalCancelButton}
                onClick={() => setIsConfirmOpen(false)}
                ref={cancelButtonRef}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.modalClearButton}
                onClick={handleConfirmClear}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
