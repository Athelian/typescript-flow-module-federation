// @flow
import * as React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import type { DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd';
import type { Task } from 'generated/graphql';
import { colors } from 'styles/common';
import { MilestoneColumnWrapperStyle } from './style';
import MilestoneForm from './components/MilestoneForm';
import TaskList from '../TaskList';

type Props = {|
  id: string,
  tasks: Array<Task>,
  index: number,
|};

export default function MilestoneColumn({ id, index, tasks }: Props) {
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
            listType="TASK"
            style={{
              backgroundColor: snapshot.isDragging ? colors.TEAL : null,
            }}
            tasks={tasks}
          />
        </div>
      )}
    </Draggable>
  );
}
