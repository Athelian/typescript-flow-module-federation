// @flow
import React from 'react';
import type { DraggableProvided } from 'react-beautiful-dnd';
import type { Task } from 'generated/graphql';
import { TaskCard } from 'components/Cards';
import { TaskItemWrapperStyle } from './style';

type Props = {|
  task: Task,
  isDragging: boolean,
  provided: DraggableProvided,
  isGroupedOver?: boolean,
|};

function TaskItem({ task, isDragging, provided }: Props) {
  return (
    <div
      className={TaskItemWrapperStyle(isDragging)}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      <TaskCard position={task.milestoneSort + 1} entity={task.entity} task={task} key={task.id} />
    </div>
  );
}

export default React.memo<Props>(TaskItem);
