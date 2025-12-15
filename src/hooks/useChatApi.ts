import { Message, Source } from '../contexts/ChatbotContext';

// API URL - can be overridden by environment variable
const API_URL = typeof window !== 'undefined'
  ? (window as any).__CHATBOT_API_URL__ || 'http://localhost:8000'
  : 'http://localhost:8000';

interface ChatApiRequest {
  query: string;
  selected_text?: string | null;
  conversation_history?: Array<{
    role: string;
    content: string;
  }>;
}

interface ChatApiResponse {
  response: string;
  sources: Source[];
}

interface UseChatApiOptions {
  timeout?: number;
}

export function useChatApi(options: UseChatApiOptions = {}) {
  const { timeout = 30000 } = options;

  const sendMessage = async (
    query: string,
    selectedText: string | null,
    history: Message[]
  ): Promise<{ response: string; sources: Source[] }> => {
    // Format conversation history for API
    const conversationHistory = history
      .slice(-10) // Last 10 messages
      .map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

    const requestBody: ChatApiRequest = {
      query,
      selected_text: selectedText || undefined,
      conversation_history: conversationHistory,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Request failed with status ${response.status}`);
      }

      const data: ChatApiResponse = await response.json();
      return {
        response: data.response,
        sources: data.sources || [],
      };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timed out. Please try again.');
        }
        throw error;
      }
      throw new Error('An unexpected error occurred.');
    }
  };

  const checkHealth = async (): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/health`, {
        method: 'GET',
      });
      return response.ok;
    } catch {
      return false;
    }
  };

  return {
    sendMessage,
    checkHealth,
    apiUrl: API_URL,
  };
}
