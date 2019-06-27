// @flow
import { useRef, useState, useEffect } from 'react';

// Refer https://usehooks.com/useHover/
export default function useHover() {
  const [value, setValue] = useState(false);

  const ref: {| current: ?HTMLElement |} = useRef(null);

  const handleMouseOver = () => setValue(true);
  const handleMouseOut = () => setValue(false);

  useEffect(() => {
    const node = ref.current;
    if (node) {
      node.addEventListener('mouseover', handleMouseOver);
      node.addEventListener('mouseout', handleMouseOut);

      return () => {
        node.removeEventListener('mouseover', handleMouseOver);
        node.removeEventListener('mouseout', handleMouseOut);
      };
    }
    return () => {};
  }, []);

  return [ref, value];
}
