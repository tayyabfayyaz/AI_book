import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Types
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: Source[];
}

export interface Source {
  title: string;
  path: string;
  snippet: string;
}

interface ChatbotState {
  isOpen: boolean;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  selectedText: string | null;
}

type ChatbotAction =
  | { type: 'TOGGLE' }
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SELECTED_TEXT'; payload: string | null }
  | { type: 'CLEAR_MESSAGES' };

// Initial state
const initialState: ChatbotState = {
  isOpen: false,
  messages: [],
  isLoading: false,
  error: null,
  selectedText: null,
};

// Reducer
function chatbotReducer(state: ChatbotState, action: ChatbotAction): ChatbotState {
  switch (action.type) {
    case 'TOGGLE':
      return { ...state, isOpen: !state.isOpen };
    case 'OPEN':
      return { ...state, isOpen: true };
    case 'CLOSE':
      return { ...state, isOpen: false };
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_SELECTED_TEXT':
      return { ...state, selectedText: action.payload };
    case 'CLEAR_MESSAGES':
      return { ...state, messages: [] };
    default:
      return state;
  }
}

// Context
interface ChatbotContextValue {
  state: ChatbotState;
  dispatch: React.Dispatch<ChatbotAction>;
  toggle: () => void;
  open: () => void;
  close: () => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedText: (text: string | null) => void;
  clearMessages: () => void;
}

const ChatbotContext = createContext<ChatbotContextValue | null>(null);

// Provider
interface ChatbotProviderProps {
  children: ReactNode;
}

export function ChatbotProvider({ children }: ChatbotProviderProps) {
  const [state, dispatch] = useReducer(chatbotReducer, initialState);

  const toggle = () => dispatch({ type: 'TOGGLE' });
  const open = () => dispatch({ type: 'OPEN' });
  const close = () => dispatch({ type: 'CLOSE' });

  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    dispatch({
      type: 'ADD_MESSAGE',
      payload: {
        ...message,
        id: crypto.randomUUID(),
        timestamp: new Date(),
      },
    });
  };

  const setLoading = (loading: boolean) => dispatch({ type: 'SET_LOADING', payload: loading });
  const setError = (error: string | null) => dispatch({ type: 'SET_ERROR', payload: error });
  const setSelectedText = (text: string | null) => dispatch({ type: 'SET_SELECTED_TEXT', payload: text });
  const clearMessages = () => dispatch({ type: 'CLEAR_MESSAGES' });

  const value: ChatbotContextValue = {
    state,
    dispatch,
    toggle,
    open,
    close,
    addMessage,
    setLoading,
    setError,
    setSelectedText,
    clearMessages,
  };

  return <ChatbotContext.Provider value={value}>{children}</ChatbotContext.Provider>;
}

// Hook
export function useChatbot() {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
}
