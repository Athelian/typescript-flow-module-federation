// @flow
import * as React from 'react';
import { ActionLabelWrapperStyle, ActionLabelStyle } from './style';

type Props = {
  children: React.Node,
};

export default function ActionLabel({ children }: Props) {
  return (
    <span className={ActionLabelWrapperStyle}>
      <div className={ActionLabelStyle}>{children}</div>
    </span>
  );
}
