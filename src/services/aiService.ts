import type { ChatMessage } from "../types/chat";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const MAX_CONTEXT_MESSAGES = 20;
const REQUEST_TIMEOUT_MS = 30_000; // 60 seconds

interface OpenAIResponse {
  choices?: Array<{
    message?: { content?: string };
  }>;
  error?: { message?: string };
}

const createTimedSignal = (
  signal?: AbortSignal,
): { signal: AbortSignal; cleanup: () => void } => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort(
      new DOMException("Request timed out. Please try again.", "TimeoutError"),
    );
  }, REQUEST_TIMEOUT_MS);

  const forwardAbort = () => {
    controller.abort(
      signal?.reason || new DOMException("Request was aborted.", "AbortError"),
    );
  };

  signal?.addEventListener("abort", forwardAbort, { once: true });

  return {
    signal: controller.signal,
    cleanup: () => {
      window.clearTimeout(timeoutId);
      signal?.removeEventListener("abort", forwardAbort);
    },
  };
};

const getRequestMessages = (messages: ChatMessage[]) => {
  return messages.slice(-MAX_CONTEXT_MESSAGES).map((message) => ({
    role: message.sender,
    content: message.content,
  }));
};

export const fetchAIResponse = async (
  messages: ChatMessage[],
  options?: { signal?: AbortSignal },
): Promise<string> => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const model = import.meta.env.VITE_OPENAI_MODEL || "gpt-3.5-turbo";
  if (!apiKey) {
    throw new Error("OpenAI API key is not configured.");
  }

  const timedSignal = createTimedSignal(options?.signal);

  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: getRequestMessages(messages),
    }),
    signal: timedSignal.signal,
  }).finally(() => {
    timedSignal.cleanup();
  });

  const data = (await response.json()) as OpenAIResponse;

  if (!response.ok) {
    const fallback =
      response.status === 401
        ? "Unauthorized. Please check your API key."
        : response.status === 429
          ? "Rate limit exceeded. Please try again later."
          : `Error ${response.status}: ${response.statusText}`;
    throw new Error(data.error?.message || fallback);
  }

  const content = data.choices?.[0]?.message?.content?.trim();

  if (!content) {
    throw new Error("Received empty response from AI assistant.");
  }
  return content;
};
