import styles from "./PromptInput.module.css";
import { useState } from "react";

export const PromptInput = () => {
  const [prompt, setPrompt] = useState("");
  return (
    <textarea
      className={styles.textarea}
      placeholder="Ask anything ..."
      value={prompt}
      onChange={(e) => setPrompt(e.target.value)}
      maxLength={2000}
      rows={1}
    ></textarea>
  );
};
