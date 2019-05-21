// @flow
import * as React from 'react';

// refer https://usehooks.com/useOnScreen/
export default function useOnScreen(
  ref: React.ElementRef<any>,
  {
    threshold,
    root,
    rootMargin,
  }: {
    threshold: Array<number>,
    root?: ?HTMLDivElement,
    rootMargin: string,
  } = {
    threshold: [0, 1],
    root: null,
    rootMargin: '0px',
  }
) {
  // State and setter for storing whether element is visible
  const [isIntersecting, setIntersecting] = React.useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update our state when observer callback fires
        if (entry.isIntersecting) {
          setIntersecting(entry.isIntersecting);
          const node = ref.current;
          if (node) {
            observer.unobserve(node);
          }
        }
      },
      {
        rootMargin,
        threshold,
        root,
      }
    );
    const node = ref.current;
    if (node) {
      observer.observe(node);
    }
    return () => {
      if (node) observer.unobserve(node);
    };
  }, [ref, root, rootMargin, threshold]);

  return isIntersecting;
}
