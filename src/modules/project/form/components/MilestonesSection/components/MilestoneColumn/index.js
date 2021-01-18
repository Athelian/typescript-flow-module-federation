// @flow
import * as React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import type { DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';
import type { Task } from 'generated/graphql';
import { colors } from 'styles/common';
import sortBy from 'modules/project/form/helpers';
import type { SortField } from 'modules/project/form/helpers';
import type { SortDirection } from 'types';
import { MilestoneColumnWrapperStyle } from './style';
import MilestoneColumnHeaderCard from '../MilestoneColumnHeaderCard';
import TaskList from '../TaskList';

type Props = {|
  id: string,
  tasks: Array<Task>,
  index: number,
  isDragDisabled: boolean,
  isDropDisabled: boolean,
  allowDragColumns: boolean,
  allowDragRows: boolean,
  onChangeTask: ({ milestoneId: string, taskId: string, task: Task }) => void,
  onRemoveTask: ({ milestoneId: string, taskId: string, isDelete: boolean }) => void,
  manualSort: {
    field: SortField,
    direction: SortDirection,
  },
|};

export default function MilestoneColumn({
  id,
  index,
  tasks,
  allowDragColumns,
  allowDragRows,
  isDragDisabled,
  isDropDisabled,
  manualSort,
  onChangeTask,
  onRemoveTask,
}: Props) {
  return (
    <Draggable draggableId={id} index={index} isDragDisabled={!allowDragColumns}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => {
        const sortedTasks = sortBy(tasks, manualSort);

        return (
          <div
            className={MilestoneColumnWrapperStyle}
            ref={provided.innerRef}
            {...provided.draggableProps}
          >
            <MilestoneColumnHeaderCard
              milestoneId={id}
              isDragging={snapshot.isDragging}
              provided={provided}
            />
            <TaskList
              listId={id}
              onChangeTask={onChangeTask}
              onRemoveTask={onRemoveTask}
              isDropDisabled={isDropDisabled}
              isDragDisabled={isDragDisabled || !allowDragRows}
              listType="TASK"
              style={{
                backgroundColor: snapshot.isDragging ? colors.TEAL : null,
              }}
              tasks={sortedTasks}
            />
          </div>
        );
      }}
    </Draggable>
  );
}
