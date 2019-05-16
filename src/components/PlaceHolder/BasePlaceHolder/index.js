// @flow
import * as React from 'react';
import { Facebook } from 'react-content-loader';
import useOnScreen from 'hooks/useOnScreen';

type OptionalProps = {
  PlaceHolderComponent: React.ComponentType<any>,
  width: number,
  height: number,
  id: string,
};

type Props = OptionalProps & {
  children: React.Node,
};

const defaultProps = {
  id: '',
  PlaceHolderComponent: Facebook,
  width: 880,
  height: 800,
};

export default function BasePlaceHolder({
  id,
  children,
  width,
  height,
  PlaceHolderComponent,
}: Props) {
  const ref = React.createRef();
  const isReady = useOnScreen(ref, { rootMargin: '0px', threshold: [0.5] });
  return (
    <div
      id={id}
      style={{
        minHeight: height,
        minWidth: width,
      }}
      ref={ref}
    >
      {isReady ? children : <PlaceHolderComponent />}
    </div>
  );
}

BasePlaceHolder.defaultProps = defaultProps;
