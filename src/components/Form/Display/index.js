// @flow
import * as React from 'react';
import { DisplayWrapperStyle } from './style';

type OptionalProps = {
  align: 'left' | 'right' | 'center',
};

type Props = OptionalProps & {
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
