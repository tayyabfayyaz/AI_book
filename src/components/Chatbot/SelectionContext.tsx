import React from 'react';
import styles from './styles.module.css';

interface SelectionContextProps {
  selectedText: string;
  onClear: () => void;
}

export function SelectionContext({ selectedText, onClear }: SelectionContextProps) {
  // Truncate display text if too long
  const displayText = selectedText.length > 200
    ? selectedText.slice(0, 200) + '...'
    : selectedText;

  return (
    <div className={styles.selectedTextContext}>
      <div className={styles.selectedTextHeader}>
        <span>Selected Text</span>
        <button
          className={styles.clearSelectionButton}
          onClick={onClear}
          aria-label="Clear selection"
        >
          Clear
        </button>
      </div>
      <div className={styles.selectedTextContent}>
        "{displayText}"
      </div>
    </div>
  );
}
