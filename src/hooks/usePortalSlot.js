// @flow
import * as React from 'react';

const root = document.getElementById('portal-root');

const PORTAL_NAME_ATTRIBUTE = 'data-portal-name';

export function hasInPortal(name: string): boolean {
  return !!root.querySelector(`[${PORTAL_NAME_ATTRIBUTE}="${name}"]`);
}

export default function usePortalSlot(name: string = 'generic'): HTMLDivElement {
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
      slotRef.current.setAttribute(PORTAL_NAME_ATTRIBUTE, name);
    }

    return slotRef.current;
  }

  return getSlotElem();
}
