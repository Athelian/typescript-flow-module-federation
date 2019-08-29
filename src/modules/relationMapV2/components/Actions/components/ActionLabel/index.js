// @flow
import * as React from 'react';
import { ActionLabelWrapperStyle } from './style';

type Props = {
  children: React.Node,
};

export default function ActionLabel({ children }: Props) {
  return <span className={ActionLabelWrapperStyle}>{children}</span>;
}
