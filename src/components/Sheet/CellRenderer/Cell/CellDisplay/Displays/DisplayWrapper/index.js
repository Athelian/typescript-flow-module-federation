// @flow
import * as React from 'react';
import { WrapperStyle } from './style';

type Props = {
  children: React.Node,
};

const DisplayWrapper = ({ children }: Props) => <div className={WrapperStyle}>{children}</div>;

export default DisplayWrapper;
