// @flow
import * as React from 'react';

/**
 * TODO: Should listen scroll only from the closest scrollable parent
 */
export default function useFixedCompanion(
  ref: { current: HTMLElement | null },
  horizontal: 'top' | 'bottom' = 'bottom',
  vertical: 'right' | 'left' = 'right'
): Object {
  const [style, setStyle] = React.useState<Object>({
    position: 'fixed',
  });

  const computeStyle = React.useCallback(() => {
    if (!ref.current) {
      return;
    }

    const viewportOffset: ClientRect = ref.current.getBoundingClientRect();

    let newStyle = {
      position: 'fixed',
    };

    switch (horizontal) {
      case 'top':
        newStyle = { ...newStyle, bottom: viewportOffset.top };
        break;
      case 'bottom':
        newStyle = { ...newStyle, top: viewportOffset.top + viewportOffset.height };
        break;
      default:
        break;
    }

    switch (vertical) {
      case 'right':
        newStyle = { ...newStyle, left: viewportOffset.left };
        break;
      case 'left':
        newStyle = { ...newStyle, right: viewportOffset.right };
        break;
      default:
        break;
    }

    setStyle(newStyle);
  }, [ref, horizontal, vertical]);

  React.useEffect(() => {
    computeStyle();
    const opts = { capture: false, passive: true };
    document.addEventListener('wheel', computeStyle, opts);

    return () => document.removeEventListener('wheel', computeStyle, opts);
  }, [computeStyle]);

  return style;
}
