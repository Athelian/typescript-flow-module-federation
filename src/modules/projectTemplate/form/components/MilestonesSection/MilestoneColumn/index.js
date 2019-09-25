// @flow
import * as React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import type { DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';
import { MilestoneColumnWrapperStyle } from './style';
import MilestoneColumnHeaderCard from '../MilestoneColumnHeaderCard';

type Props = {|
  id: string,
  index: number,
  draggable: boolean,
|};

export default function MilestoneColumn({ id, index, draggable }: Props) {
  return (
    <Draggable draggableId={id} index={index} isDragDisabled={!draggable}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <div
          className={MilestoneColumnWrapperStyle}
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <MilestoneColumnHeaderCard
            milestoneIndex={index}
            isDragging={snapshot.isDragging}
            provided={provided}
          />
        </div>
      )}
    </Draggable>
  );
}
