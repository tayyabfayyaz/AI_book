import React from 'react';
import { Message, Source } from '../../contexts/ChatbotContext';
import styles from './styles.module.css';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={`${styles.messageBubble} ${isUser ? styles.userMessage : styles.botMessage}`}
    >
      <div className={styles.messageContent}>
        {isUser ? (
          message.content
        ) : (
          <MarkdownContent content={message.content} />
        )}
      </div>
      {!isUser && message.sources && message.sources.length > 0 && (
        <SourceReferences sources={message.sources} />
      )}
    </div>
  );
}

interface MarkdownContentProps {
  content: string;
}

function MarkdownContent({ content }: MarkdownContentProps) {
  // Simple markdown rendering - convert basic markdown to HTML
  const renderContent = () => {
    // Split by code blocks first
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        // Code block
        const code = part.slice(3, -3).replace(/^\w+\n/, ''); // Remove language identifier
        return (
          <pre key={index} className={styles.codeBlock}>
            <code>{code}</code>
          </pre>
        );
      }

      // Process inline elements
      return (
        <span key={index}>
          {processInlineMarkdown(part)}
        </span>
      );
    });
  };

  return <>{renderContent()}</>;
}

function processInlineMarkdown(text: string): React.ReactNode[] {
  const elements: React.ReactNode[] = [];
  let currentIndex = 0;

  // Process bold, italic, and inline code
  const patterns = [
    { regex: /\*\*(.+?)\*\*/g, render: (match: string, p1: string, key: number) => <strong key={key}>{p1}</strong> },
    { regex: /\*(.+?)\*/g, render: (match: string, p1: string, key: number) => <em key={key}>{p1}</em> },
    { regex: /`(.+?)`/g, render: (match: string, p1: string, key: number) => <code key={key}>{p1}</code> },
  ];

  // Split by newlines first
  const lines = text.split('\n');

  return lines.map((line, lineIndex) => {
    const lineElements: React.ReactNode[] = [];
    let remaining = line;
    let elementKey = 0;

    // Simple inline code replacement
    remaining = remaining.replace(/`([^`]+)`/g, (_, code) => `<code>${code}</code>`);

    // Simple bold replacement
    remaining = remaining.replace(/\*\*([^*]+)\*\*/g, (_, bold) => `<strong>${bold}</strong>`);

    // Simple italic replacement
    remaining = remaining.replace(/\*([^*]+)\*/g, (_, italic) => `<em>${italic}</em>`);

    // Render as HTML (simplified)
    const renderLine = () => {
      if (remaining.includes('<code>') || remaining.includes('<strong>') || remaining.includes('<em>')) {
        // Use dangerouslySetInnerHTML for rendered content
        return <span dangerouslySetInnerHTML={{ __html: remaining }} />;
      }
      return remaining;
    };

    return (
      <React.Fragment key={lineIndex}>
        {renderLine()}
        {lineIndex < lines.length - 1 && <br />}
      </React.Fragment>
    );
  });
}

interface SourceReferencesProps {
  sources: Source[];
}

function SourceReferences({ sources }: SourceReferencesProps) {
  return (
    <div className={styles.sources}>
      <div className={styles.sourcesHeader}>Sources</div>
      {sources.map((source, index) => (
        <a
          key={index}
          href={source.path}
          className={styles.sourceLink}
          target="_self"
        >
          {source.title}
        </a>
      ))}
    </div>
  );
}
