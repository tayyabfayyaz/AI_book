import React from 'react';
import { ChatbotProvider } from '../contexts/ChatbotContext';
import { Chatbot } from '../components/Chatbot';

// Root wrapper that includes the chatbot provider
function Root({ children }) {
  return (
    <ChatbotProvider>
      {children}
      <Chatbot />
    </ChatbotProvider>
  );
}

export default Root;
