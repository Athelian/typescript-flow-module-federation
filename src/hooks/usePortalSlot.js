// @flow
import * as React from 'react';

const root = document.getElementById('portal-root');

export function usePortalSlot(): HTMLDivElement {
  const slotRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    root.appendChild(slotRef.current);

    return () => {
      root.removeChild(slotRef.current);
    };
  }, []);

  function getSlotElem() {
    if (!slotRef.current) {
      slotRef.current = document.createElement('div');
    }

    return slotRef.current;
  }

  return getSlotElem();
}
