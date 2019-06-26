// @flow
import React from 'react';
import type { DraggableProvided } from 'react-beautiful-dnd';
import type { Task } from 'generated/graphql';
import { TaskCard } from 'components/Cards';
import { ContainerStyle } from './style';

type Props = {
  task: Task,
  isDragging: boolean,
  provided: DraggableProvided,
  isGroupedOver?: boolean,
  position: number,
};

function TaskItem({ task, position, isDragging, isGroupedOver, provided }: Props) {
  return (
    <div
      className={ContainerStyle(isDragging, Boolean(isGroupedOver))}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      <TaskCard position={position} entity={task.entity} task={task} key={task.id} />
    </div>
  );
}

export default React.memo<Props>(TaskItem);
