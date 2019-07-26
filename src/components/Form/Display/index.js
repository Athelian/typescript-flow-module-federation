// @flow
import * as React from 'react';
import Blackout from '../Blackout';
import { DisplayWrapperStyle } from './style';

type OptionalProps = {
  align: 'left' | 'right' | 'center',
  width: string,
  height: string,
  color: string,
  fontSize: string,
  blackout: boolean,
};

type Props = OptionalProps & {
  children: React.Node,
};

const defaultProps = {
  align: 'left',
  width: '100%',
  height: '20px',
  color: 'BLACK',
  fontSize: 'MAIN',
  blackout: false,
};

const Display = ({ align, width, height, color, fontSize, blackout, children, ...rest }: Props) =>
  blackout ? (
    <Blackout width={width} height={height} />
  ) : (
    <div className={DisplayWrapperStyle({ align, width, height, color, fontSize })} {...rest}>
      {children}
    </div>
  );

Display.defaultProps = defaultProps;

export default Display;
