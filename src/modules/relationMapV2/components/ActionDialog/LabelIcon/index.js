// @flow
import * as React from 'react';
import { LabelStyle } from './style';

type Props = {|
  color: string,
  children: React.Node,
|};

export default function ActionDialog({ color, children }: Props) {
  return <span className={LabelStyle(color)}>{children}</span>;
}
