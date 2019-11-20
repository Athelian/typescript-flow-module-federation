// @flow
import * as React from 'react';
import { DroppableOverlayStyle, MessageStyle } from './style';

type Props = {|
  isDragging: boolean,
  canDrop: boolean,
  isOver: boolean,
  message: React.Node,
|};

export default function DroppableOverlay({ isDragging, canDrop, isOver, message }: Props) {
  if (!isDragging) return null;

  return (
    <div className={DroppableOverlayStyle(canDrop, isOver)}>
      <div className={MessageStyle(canDrop)}>{message}</div>
    </div>
  );
}
