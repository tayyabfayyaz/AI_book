import { useState, useEffect, useCallback } from 'react';

const MAX_SELECTION_LENGTH = 2000;

export function useTextSelection(): string | null {
  const [selectedText, setSelectedText] = useState<string | null>(null);

  const handleSelectionChange = useCallback(() => {
    const selection = window.getSelection();

    if (!selection || selection.isCollapsed) {
      // No selection or collapsed selection
      setSelectedText(null);
      return;
    }

    let text = selection.toString().trim();

    if (!text) {
      setSelectedText(null);
      return;
    }

    // Truncate if too long
    if (text.length > MAX_SELECTION_LENGTH) {
      text = text.slice(0, MAX_SELECTION_LENGTH);
    }

    setSelectedText(text);
  }, []);

  useEffect(() => {
    // Debounce the selection change handler
    let timeoutId: NodeJS.Timeout;

    const debouncedHandler = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleSelectionChange, 150);
    };

    document.addEventListener('selectionchange', debouncedHandler);
    document.addEventListener('mouseup', debouncedHandler);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('selectionchange', debouncedHandler);
      document.removeEventListener('mouseup', debouncedHandler);
    };
  }, [handleSelectionChange]);

  return selectedText;
}
