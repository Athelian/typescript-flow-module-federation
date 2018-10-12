// @flow
import * as React from 'react';
import { DisplayWrapperStyle } from './style';

type OptionalProps = {
  align: 'left' | 'right' | 'center',
  color: string,
  fontSize: string,
};

type Props = OptionalProps & {
  children: React.Node,
};

const defaultProps = {
  align: 'right',
  color: 'BLACK',
  fontSize: 'MAIN',
};

const Display = ({ align, color, fontSize, children }: Props) => (
  <div className={DisplayWrapperStyle(align, color, fontSize)}>{children}</div>
);

Display.defaultProps = defaultProps;

export default Display;
