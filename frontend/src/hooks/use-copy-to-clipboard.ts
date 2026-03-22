import { useState, useCallback } from 'react';

/**
 * A custom hook to copy text to the clipboard.
 * 
 * @returns An object containing the copied text, success state, and copy function
 */
export function useCopyToClipboard() {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported');
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setIsCopied(true);
      
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
      
      return true;
    } catch (error) {
      console.warn('Copy failed', error);
      setCopiedText(null);
      setIsCopied(false);
      return false;
    }
  }, []);

  return { copiedText, isCopied, copy };
}
