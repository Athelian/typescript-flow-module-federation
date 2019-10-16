// @flow
import * as React from 'react';
import { DisplayWrapperStyle } from './style';

type Props = {
  children: React.Node,
};

const DisplayWrapper = ({ children }: Props) => (
  <div className={DisplayWrapperStyle}>{children}</div>
);

export default DisplayWrapper;
