// @flow
import * as React from 'react';
import { TableRowWrapperStyle } from './style';

type Props = {
  children: React.Node,
};

export default function TableRow({ children }: Props) {
  return <div className={TableRowWrapperStyle}>{children}</div>;
}
