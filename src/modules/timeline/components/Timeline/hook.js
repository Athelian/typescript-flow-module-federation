// @flow
import { useState, useEffect } from 'react';

export function useScrollToBottom() {
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref) {
      ref.scrollTop = ref.scrollHeight;
    }
  }, [ref]);

  return [setRef];
}

export default useScrollToBottom;
