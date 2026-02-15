import type { ChatMessage } from "../types/chat";

export const fetchAIResponse = async (messages: ChatMessage[]): Promise<string> => {
  return `This is a mock response from the AI assistant based on the following messages: ${JSON.stringify(messages)}`;
};
