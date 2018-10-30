// @flow
import * as React from 'react';
import { WrapperRowStyle } from './style';

type Props = {
  children: React.Node,
};

export default function TableRow({ children }: Props) {
  return <div className={WrapperRowStyle}>{children}</div>;
}
