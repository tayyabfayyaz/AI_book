import React, { useEffect, useRef } from 'react';
import { useChatbot } from '../../contexts/ChatbotContext';
import { MessageBubble } from './MessageBubble';
import styles from './styles.module.css';

export function ChatWindow() {
  const { state } = useChatbot();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages, state.isLoading]);

  return (
    <div className={styles.messagesContainer}>
      {state.messages.length === 0 && !state.isLoading ? (
        <WelcomeMessage />
      ) : (
        <>
          {state.messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {state.isLoading && <LoadingIndicator />}
          {state.error && <ErrorMessage error={state.error} />}
        </>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}

function WelcomeMessage() {
  return (
    <div className={styles.welcomeMessage}>
      <h3>Welcome to AI Book Assistant</h3>
      <p>Ask me anything about the book content. I'm here to help!</p>
    </div>
  );
}

function LoadingIndicator() {
  return (
    <div className={styles.loadingIndicator}>
      <div className={styles.loadingDot} />
      <div className={styles.loadingDot} />
      <div className={styles.loadingDot} />
    </div>
  );
}

interface ErrorMessageProps {
  error: string;
}

function ErrorMessage({ error }: ErrorMessageProps) {
  const { setError } = useChatbot();

  return (
    <div className={styles.errorMessage}>
      <span>{error}</span>
      <button className={styles.retryButton} onClick={() => setError(null)}>
        Dismiss
      </button>
    </div>
  );
}
