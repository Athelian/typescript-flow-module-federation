// @flow
import * as React from 'react';

const root = document.getElementById('portal-root');

export default function usePortalSlot(): HTMLDivElement {
  const slotRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (root && slotRef.current) root.appendChild(slotRef.current);

    return () => {
      if (root && slotRef.current) root.removeChild(slotRef.current);
    };
  }, []);

  function getSlotElem(): HTMLDivElement {
    if (!slotRef.current) {
      slotRef.current = document.createElement('div');
    }

    return slotRef.current;
  }

  return getSlotElem();
}
