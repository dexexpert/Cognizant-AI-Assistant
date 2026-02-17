import styles from "./PromptInput.module.css";
import { useRef, useState, type FormEvent } from "react";

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
  const submitPrompt = async () => {
    const trimmed = prompt.trim();
    if (!trimmed || loading) {
      return;
    }
    await onSubmit(trimmed);
    setPrompt("");
    textareaRef.current?.focus();
  };
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await submitPrompt();
  };
  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <textarea
        ref={textareaRef}
        id="prompt"
        className={styles.textarea}
        placeholder="Ask anything ..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        maxLength={2000}
        rows={1}
        disabled={loading}
        aria-invalid={hasError}
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
    </form>
  );
};
