// @flow
import * as React from 'react';
import { DraggedPlaceholderStyle, MessageStyle } from './style';

type Props = {|
  message: React.Node,
|};

export default function DraggedPlaceholder({ message }: Props) {
  return (
    <div className={DraggedPlaceholderStyle}>
      <div className={MessageStyle}>{message}</div>
    </div>
  );
}
