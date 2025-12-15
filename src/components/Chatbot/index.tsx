import React, { useCallback, useEffect } from 'react';
import { useChatbot } from '../../contexts/ChatbotContext';
import { useChatApi } from '../../hooks/useChatApi';
import { useTextSelection } from '../../hooks/useTextSelection';
import { ChatWindow } from './ChatWindow';
import { ChatInput } from './ChatInput';
import { SelectionContext } from './SelectionContext';
import styles from './styles.module.css';

export function Chatbot() {
  const {
    state,
    toggle,
    close,
    addMessage,
    setLoading,
    setError,
    setSelectedText,
  } = useChatbot();

  const { sendMessage } = useChatApi();
  const selectedText = useTextSelection();

  // Update selected text in context when it changes
  useEffect(() => {
    if (selectedText) {
      setSelectedText(selectedText);
    }
  }, [selectedText, setSelectedText]);

  // Handle sending a message
  const handleSend = useCallback(async (content: string) => {
    // Add user message
    addMessage({ role: 'user', content });

    setLoading(true);
    setError(null);

    try {
      const result = await sendMessage(
        content,
        state.selectedText,
        state.messages
      );

      // Add bot response
      addMessage({
        role: 'assistant',
        content: result.response,
        sources: result.sources,
      });
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : 'An unexpected error occurred.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [addMessage, sendMessage, setLoading, setError, state.selectedText, state.messages]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && state.isOpen) {
        close();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [state.isOpen, close]);

  return (
    <div className={styles.chatbotContainer}>
      {state.isOpen && (
        <div className={styles.chatWindow} role="dialog" aria-label="Chat window">
          <Header onClose={close} />
          {state.selectedText && (
            <SelectionContext
              selectedText={state.selectedText}
              onClear={() => setSelectedText(null)}
            />
          )}
          <ChatWindow />
          <ChatInput onSend={handleSend} disabled={state.isLoading} />
        </div>
      )}

      <button
        className={styles.toggleButton}
        onClick={toggle}
        aria-label={state.isOpen ? 'Close chat' : 'Open chat'}
        aria-expanded={state.isOpen}
      >
        {state.isOpen ? <CloseIcon /> : <ChatIcon />}
      </button>
    </div>
  );
}

interface HeaderProps {
  onClose: () => void;
}

function Header({ onClose }: HeaderProps) {
  return (
    <div className={styles.chatHeader}>
      <div className={styles.chatTitle}>
        <ChatIcon />
        AI Book Assistant
      </div>
      <button
        className={styles.closeButton}
        onClick={onClose}
        aria-label="Close chat"
      >
        <CloseIcon />
      </button>
    </div>
  );
}

function ChatIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export default Chatbot;
