import styles from "./App.module.css";
import { ChatHistory } from "./components/ChatHistory";
import { PromptInput } from "./components/PromptInput";
import { useChat } from "./hooks/useChat";

function App() {
  const { messages, loading, error, submitPrompt } = useChat();

  return (
    <div className={styles.main}>
      <section className={styles.panel} aria-label="AI Assistant app">
        <header>Cognizant AI Assistant</header>
        <div></div>
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
    </div>
  );
}

export default App;
