// @flow
import * as React from 'react';

const PORTAL_ROOT = 'portal-root';
const PORTAL_NAME_ATTRIBUTE = 'data-portal-name';

export function getPortalRoot(): HTMLElement {
  const root = document.getElementById(PORTAL_ROOT);
  if (!root) {
    throw new Error('Element #portal-root is missing in document.');
  }

  return root;
}

export function hasInPortal(name: string): boolean {
  return !!getPortalRoot().querySelector(`[${PORTAL_NAME_ATTRIBUTE}="${name}"]`);
}

export default function usePortalSlot(name: string = 'generic'): HTMLDivElement {
  const slotRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const root = getPortalRoot();
    if (slotRef.current && root && slotRef.current) root.appendChild(slotRef.current);

    return () => {
      if (slotRef.current && root && slotRef.current) root.removeChild(slotRef.current);
    };
  }, []);

  function getSlotElem(): HTMLDivElement {
    if (!slotRef.current) {
      const slot = document.createElement('div');
      slot.setAttribute(PORTAL_NAME_ATTRIBUTE, name);
      slotRef.current = slot;
    }

    return slotRef.current;
  }

  return getSlotElem();
}
