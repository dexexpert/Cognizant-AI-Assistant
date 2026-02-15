import styles from "./App.module.css";
import { ChatHistory } from "./components/ChatHistory";
import { PromptInput } from "./components/PromptInput";

function App() {
  return (
    <div className={styles.main}>
      <section className={styles.panel} aria-label="AI Assistant app">
        <header>Cognizant AI Assistant</header>
        <div></div>
        <ChatHistory messages={[]} loading={false} />
        <PromptInput />
      </section>
    </div>
  );
}

export default App;
