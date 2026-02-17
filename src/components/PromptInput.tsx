import styles from "./PromptInput.module.css";
import { useRef, useState, type SyntheticEvent, type KeyboardEvent, useEffect } from "react";

interface PromptInputProps {
  loading: boolean;
  hasError?: boolean;
  onSubmit: (prompt: string) => Promise<void>;
}

export const PromptInput = ({
  loading,
  hasError = false,
  onSubmit,
}: PromptInputProps) => {
  const [prompt, setPrompt] = useState("");
  const trimmedPrompt = prompt.trim();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if(!textarea) return;
    textarea.style.height = "auto";

    const computed = window.getComputedStyle(textarea);
    const lineHeight = Number.parseFloat(computed.lineHeight) || 22;
    const paddingHeight = Number.parseFloat(computed.paddingTop) + Number.parseFloat(computed.paddingBottom);
    const borderHeight = Number.parseFloat(computed.borderTopWidth) + Number.parseFloat(computed.borderBottomWidth);
    const maxHeight = lineHeight * 10 + paddingHeight + borderHeight;

    const nextHeight = Math.min(textarea.scrollHeight, maxHeight);
    textarea.style.height = `${nextHeight}px`;
    textarea.style.overflowY = textarea.scrollHeight > maxHeight ? "auto" : "hidden";
  }, [prompt]);

  const submitPrompt = async () => {
    const trimmed = prompt.trim();
    if (!trimmed || loading) {
      return;
    }
    await onSubmit(trimmed);
    setPrompt("");
    textareaRef.current?.focus();
  };
  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    event.preventDefault();
    await submitPrompt();
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void submitPrompt();
    }
  };
  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.composerRow}>
        <textarea
          ref={textareaRef}
          id="prompt"
          className={styles.textarea}
          placeholder="Ask anything ..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={2000}
          rows={1}
          disabled={loading}
          aria-invalid={hasError}
          aria-describedby="prompt-hint"
        ></textarea>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading || !trimmedPrompt}
          aria-label={loading ? "Generating response" : "Send message"}
        >
          <svg
            viewBox="0 0 24 24"
            className={styles.sendIcon}
            aria-hidden="true"
            focusable="false"
          >
            <path d="M12 5l-6 6h4v8h4v-8h4z" />
          </svg>
        </button>
      </div>
      <p id="prompt-hint" className={styles.hint}>
        Press Enter to send, Shift + Enter for a new line. {prompt.length}/2000
      </p>
    </form>
  );
};
