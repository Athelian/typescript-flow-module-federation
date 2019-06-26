// @flow
import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import type {
  DroppableProvided,
  DroppableStateSnapshot,
  DraggableProvided,
  DraggableStateSnapshot,
} from 'react-beautiful-dnd';
import type { Task } from 'generated/graphql';
import { DropZoneStyle, WrapperStyle, ScrollContainerStyle } from './style';
import TaskItem from '../TaskItem';

type Props = {|
  listId?: string,
  listType?: string,
  tasks: Task[],
  internalScroll?: boolean,
  scrollContainerStyle?: Object,
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

type InnerListProps = {|
  dropProvided: DroppableProvided,
  tasks: Task[],
|};

function InnerList(props: InnerListProps) {
  const { tasks, dropProvided } = props;
  return (
    <div className={DropZoneStyle} ref={dropProvided.innerRef}>
      <InnerTaskList tasks={tasks} />
      {dropProvided.placeholder}
    </div>
  );
}

export default function TaskList(props: Props) {
  const {
    ignoreContainerClipping,
    internalScroll,
    scrollContainerStyle,
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
      {(dropProvided: DroppableProvided, dropSnapshot: DroppableStateSnapshot) => (
        <div
          className={WrapperStyle({
            isDraggingOver: dropSnapshot.isDraggingOver,
            isDraggingFrom: Boolean(dropSnapshot.draggingFromThisWith),
            isDropDisabled: Boolean(isDropDisabled),
          })}
          style={style}
          {...dropProvided.droppableProps}
        >
          {internalScroll ? (
            <div className={ScrollContainerStyle} style={scrollContainerStyle}>
              <InnerList tasks={tasks} dropProvided={dropProvided} />
            </div>
          ) : (
            <InnerList tasks={tasks} dropProvided={dropProvided} />
          )}
        </div>
      )}
    </Droppable>
  );
}
