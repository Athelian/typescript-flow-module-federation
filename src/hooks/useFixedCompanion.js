// @flow
import * as React from 'react';

export type Offset = {
  top: number,
  left: number,
};

export default function useFixedCompanion(
  ref: { current: HTMLElement | null },
  side: 'bottom' | 'right' = 'bottom'
): Offset {
  const [offset, setOffset] = React.useState<Offset>({ top: 0, left: 0 });

  const computeOffset = React.useCallback(() => {
    if (!ref.current) {
      return;
    }

    const viewportOffset: ClientRect = ref.current.getBoundingClientRect();

    switch (side) {
      case 'bottom':
        setOffset({
          top: viewportOffset.top + viewportOffset.height,
          left: viewportOffset.left,
        });
        break;
      case 'right':
        setOffset({
          top: viewportOffset.top,
          left: viewportOffset.left + viewportOffset.width,
        });
        break;
      default:
        break;
    }
  }, [ref, side]);

  React.useEffect(() => {
    computeOffset();
    document.addEventListener('wheel', computeOffset);

    return () => document.removeEventListener('wheel', computeOffset);
  }, [computeOffset]);

  return offset;
}
