// @flow
import * as React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import type { DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';
import type { Task } from 'generated/graphql';
import { colors } from 'styles/common';
import sortBy from 'modules/project/form/helpers';
import type { SortField, SortDirection } from 'modules/project/form/helpers';
import { MilestoneColumnWrapperStyle } from './style';
import MilestoneForm from './components/MilestoneForm';
import TaskList from '../TaskList';

type Props = {|
  id: string,
  tasks: Array<Task>,
  index: number,
  isDragDisabled: boolean,
  isDropDisabled: boolean,
  onChangeTask: ({ milestoneId: string, taskId: string, task: Task }) => void,
  manualSort: {
    field: SortField,
    direction: SortDirection,
  },
|};

export default function MilestoneColumn({
  id,
  index,
  tasks,
  isDragDisabled,
  isDropDisabled,
  manualSort,
  onChangeTask,
}: Props) {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <div
          className={MilestoneColumnWrapperStyle}
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <MilestoneForm milestoneId={id} isDragging={snapshot.isDragging} provided={provided} />
          <TaskList
            listId={id}
            onChangeTask={onChangeTask}
            isDropDisabled={isDropDisabled}
            isDragDisabled={isDragDisabled}
            listType="TASK"
            style={{
              backgroundColor: snapshot.isDragging ? colors.TEAL : null,
            }}
            tasks={sortBy(tasks, manualSort)}
          />
        </div>
      )}
    </Draggable>
  );
}
