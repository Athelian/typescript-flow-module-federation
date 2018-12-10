// @flow
import * as React from 'react';
import { DisplayWrapperStyle } from './style';

type OptionalProps = {
  align: 'left' | 'right' | 'center',
  width: string,
  color: string,
  fontSize: string,
};

type Props = OptionalProps & {
  children: React.Node,
};

const defaultProps = {
  align: 'right',
  width: '100%',
  color: 'BLACK',
  fontSize: 'MAIN',
};

const Display = ({ align, width, color, fontSize, children }: Props) => (
  <div className={DisplayWrapperStyle({ align, width, color, fontSize })}>{children}</div>
);

Display.defaultProps = defaultProps;

export default Display;
