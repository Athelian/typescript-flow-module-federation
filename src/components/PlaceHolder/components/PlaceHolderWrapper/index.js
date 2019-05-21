// @flow
import * as React from 'react';
import useOnScreen from 'hooks/useOnScreen';

type Props = {
  children: ({ isReady: boolean }) => React.Node,
};

export default function PlaceHolderWrapper({ children }: Props) {
  const ref = React.createRef();
  const isReady = useOnScreen(ref, { rootMargin: '0px', threshold: [0.2, 0.8, 1] });

  return <div ref={ref}>{children({ isReady })}</div>;
}
