// @flow
import * as React from 'react';
import { DisplayWrapperStyle } from './style';

type OptionalProps = {
  align: 'left' | 'right' | 'center',
  width: string,
  height: string,
  color: string,
  fontSize: string,
};

type Props = OptionalProps & {
  children: React.Node,
};

const defaultProps = {
  align: 'right',
  width: '100%',
  height: '20px',
  color: 'BLACK',
  fontSize: 'MAIN',
};

const Display = ({ align, width, height, color, fontSize, children, ...rest }: Props) => (
  <div className={DisplayWrapperStyle({ align, width, height, color, fontSize })} {...rest}>
    {children}
  </div>
);

Display.defaultProps = defaultProps;

export default Display;
