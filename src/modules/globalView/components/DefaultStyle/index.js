// @flow
import * as React from 'react';
import { DefaultStyleStyle } from './style';

type Props = {
  children: React.Node,
};

const DefaultStyle = ({ children }: Props): React.Node => (
  <div className={DefaultStyleStyle}>{children}</div>
);

export default DefaultStyle;
