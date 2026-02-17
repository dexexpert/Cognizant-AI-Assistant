import { useCallback, useEffect, useReducer, useRef } from "react";
import type { ChatMessage } from "../types/chat";
import { fetchAIResponse } from "../services/aiService";

const STORAGE_KEY = "cognizant_chat_history";
const MAX_StORED_MESSAGES = 50;

interface ChatState {
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
}

type ChatAction =
  | { type: "submit_start"; payload: ChatMessage }
  | { type: "submit_success"; payload: ChatMessage }
  | { type: "submit_error"; payload: string }
  | { type: "clear" };

const createMessage = (
  role: ChatMessage["sender"],
  content: string,
): ChatMessage => {
  return {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`,
    sender: role,
    content,
    timestamp: new Date().toISOString(),
  };
};

const isChatMessage = (value: unknown): value is ChatMessage => {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;

  return (
    typeof v.id === "string" &&
    typeof v.sender === "string" &&
    typeof v.content === "string" &&
    typeof v.timestamp === "string"
  );
};

const getInitialMessages = (): ChatMessage[] => {
  try {
    const serializedMessages = localStorage.getItem(STORAGE_KEY);
    if (!serializedMessages) return [];
    const messages = JSON.parse(serializedMessages) as ChatMessage[];
    if (!Array.isArray(messages)) return [];
    return messages.filter(isChatMessage).slice(-MAX_StORED_MESSAGES);
  } catch (err) {
    console.error("Failed to load chat history from localStorage:", err);
    return [];
  }
};

const reducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case "submit_start":
      return {
        ...state,
        loading: true,
        error: null,
        messages: [...state.messages, action.payload],
      };
    case "submit_success":
      return {
        ...state,
        loading: false,
        error: null,
        messages: [...state.messages, action.payload],
      };
    case "submit_error":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case "clear":
      return {
        messages: [],
        loading: false,
        error: null,
      };
    default:
      return state;
  }
};

export const useChat = () => {
  const abortControllerRef = useRef<AbortController | null>(null);
  const [state, dispatch] = useReducer(reducer, {
    messages: getInitialMessages(),
    loading: false,
    error: null,
  });

  useEffect(() => {
    const recentMessages = state.messages.slice(-MAX_StORED_MESSAGES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recentMessages));
  }, [state.messages]);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const submitPrompt = useCallback(
    async (prompt: string) => {
      const trimmedPrompt = prompt.trim();
      if (!trimmedPrompt || state.loading) return;
      const userMessage = createMessage("user", trimmedPrompt);
      const conversation = [...state.messages, userMessage];
      dispatch({ type: "submit_start", payload: userMessage });

      try {
        const controller = new AbortController();
        abortControllerRef.current = controller;
        const aiResponse = await fetchAIResponse(conversation, {
          signal: controller.signal,
        });
        dispatch({
          type: "submit_success",
          payload: createMessage("assistant", aiResponse),
        });
      } catch (err) {
        console.error("Error fetching AI response:", err);
        if (err instanceof DOMException && err.name === 'AbortError') {
          return
        }

        if(err instanceof DOMException && err.name === 'TimeoutError') {
          dispatch({
            type: "submit_error",
            payload: err.message || "The request timed out. Please try again.",
          });
          return;
        }
        const message = err instanceof Error ? err.message : "An unknown error occurred.";
        dispatch({
          type: "submit_error",
          payload: message,
        });
      } finally {
        abortControllerRef.current = null;
      }
    },
    [state.loading, state.messages],
  );

  const clearConversation = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    localStorage.removeItem(STORAGE_KEY);
    dispatch({ type: "clear" });
  }, []);

  return {
    messages: state.messages,
    loading: state.loading,
    error: state.error,
    submitPrompt,
    clearConversation,
  };
};
