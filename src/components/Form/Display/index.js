// @flow
import * as React from 'react';
import { DisplayWrapperStyle } from './style';

type Props = {
  align: 'left' | 'right' | 'center',
  children: React.Node,
};

const defaultProps = {
  align: 'right',
};

const Display = ({ align, children }: Props) => (
  <div className={DisplayWrapperStyle(align)}>{children}</div>
);

Display.defaultProps = defaultProps;

export default Display;
