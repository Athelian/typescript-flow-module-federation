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
  listId: string,
  listType?: string,
  tasks: Task[],
  isDropDisabled?: boolean,
  isDragDisabled?: boolean,
  style?: Object,
  ignoreContainerClipping?: boolean,
  onChangeTask: ({ milestoneId: string, taskId: string, task: Task }) => void,
|};

type TaskListProps = {|
  tasks: Task[],
  isDragDisabled: boolean,
  onChange: (taskId: string, task: Task) => void,
|};

const InnerTaskList = React.memo(function InnerTaskList({
  tasks,
  onChange,
  isDragDisabled,
}: TaskListProps) {
  return tasks.map((task: Task, index: number) => (
    <Draggable key={task.id} draggableId={task.id} index={index} isDragDisabled={isDragDisabled}>
      {(dragProvided: DraggableProvided, dragSnapshot: DraggableStateSnapshot) => (
        <TaskItem
          onChange={onChange}
          task={task}
          key={task.id}
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
    isDragDisabled,
    listId = 'LIST',
    listType,
    style,
    tasks,
    onChangeTask,
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
          className={MilestoneTaskListBodyStyle}
          style={style}
          {...dropProvided.droppableProps}
          ref={dropProvided.innerRef}
        >
          <InnerTaskList
            onChange={(taskId, updateTask) =>
              onChangeTask({ milestoneId: listId, taskId, task: updateTask })
            }
            tasks={tasks}
            isDragDisabled={Boolean(isDragDisabled)}
          />
          {dropProvided.placeholder}
        </div>
      )}
    </Droppable>
  );
}
