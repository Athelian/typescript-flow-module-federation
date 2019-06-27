// @flow
import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import type {
  DroppableProvided,
  DraggableProvided,
  DraggableStateSnapshot,
} from 'react-beautiful-dnd';
import type { Task } from 'generated/graphql';
import { MilestoneTaskListBodyStyle } from './style';
import TaskItem from '../TaskItem';

type Props = {|
  listId?: string,
  listType?: string,
  tasks: Task[],
  isDropDisabled?: boolean,
  style?: Object,
  ignoreContainerClipping?: boolean,
|};

type TaskListProps = {|
  tasks: Task[],
|};

const InnerTaskList = React.memo(function InnerTaskList({ tasks }: TaskListProps) {
  return tasks.map((task: Task, index: number) => (
    <Draggable key={task.id} draggableId={task.id} index={index}>
      {(dragProvided: DraggableProvided, dragSnapshot: DraggableStateSnapshot) => (
        <TaskItem
          task={task}
          key={task.id}
          position={index}
          isDragging={dragSnapshot.isDragging}
          isGroupedOver={Boolean(dragSnapshot.combineTargetFor)}
          provided={dragProvided}
        />
      )}
    </Draggable>
  ));
});

export default function TaskList(props: Props) {
  const {
    ignoreContainerClipping,
    isDropDisabled,
    listId = 'LIST',
    listType,
    style,
    tasks,
  } = props;

  return (
    <Droppable
      droppableId={listId}
      type={listType}
      ignoreContainerClipping={ignoreContainerClipping}
      isDropDisabled={isDropDisabled}
    >
      {(dropProvided: DroppableProvided) => (
        <div
          className={MilestoneTaskListBodyStyle({
            isDropDisabled: Boolean(isDropDisabled),
          })}
          style={style}
          {...dropProvided.droppableProps}
          ref={dropProvided.innerRef}
        >
          <InnerTaskList tasks={tasks} />
          {dropProvided.placeholder}
        </div>
      )}
    </Droppable>
  );
}