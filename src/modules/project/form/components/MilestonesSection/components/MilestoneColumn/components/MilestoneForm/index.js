// @flow

import * as React from 'react';
import type { DraggableProvided } from 'react-beautiful-dnd';
import { WrapperStyle } from './style';

type Props = {
  provided: DraggableProvided,
  milestoneId: string,
  isDragging: boolean,
};

export default function MilestoneForm({ provided, milestoneId, isDragging }: Props) {
  return (
    <div className={WrapperStyle(isDragging)}>
      <h3 {...provided.dragHandleProps}>{milestoneId}</h3>
    </div>
  );
}
