// @flow
import React, { Component } from 'react';
import { Subscribe } from 'unstated';
import type { Task } from 'generated/graphql';
import type { DropResult, DroppableProvided } from 'react-beautiful-dnd';
import { ProjectMilestonesContainer } from 'modules/project/form/containers';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import MilestoneColumn from '../MilestoneColumn';
import NewButtonColumn from '../NewButtonColumn';
import { MilestonesSectionWrapperStyle } from './style';

type MilestoneMap = {
  [id: string]: Array<Task>,
};

type Props = {
  columns: Object,
  ordered: Object,
  onChangeOrdering: (Array<string>) => void,
  onChangeColumns: MilestoneMap => void,
  editable: {
    createMilestone: boolean,
  },
};

const reorder = (list: any[], startIndex: number, endIndex: number): any[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const reorderMilestoneMap = ({ milestoneMap, source, destination }: Object): Object => {
  const current: Object[] = [...milestoneMap[source.droppableId]];
  const next: Object[] = [...milestoneMap[destination.droppableId]];
  const target: Object = current[source.index];

  // moving to same list
  if (source.droppableId === destination.droppableId) {
    const reordered: Object[] = reorder(current, source.index, destination.index);
    const result: Object = {
      ...milestoneMap,
      [source.droppableId]: reordered,
    };
    return {
      milestoneMap: result,
    };
  }
  // moving to different list

  // remove from original
  current.splice(source.index, 1);
  // insert into next
  next.splice(destination.index, 0, target);

  const result: Object = {
    ...milestoneMap,
    [source.droppableId]: current,
    [destination.droppableId]: next,
  };

  return {
    milestoneMap: result,
  };
};

export default class Board extends Component<Props> {
  boardRef: ?HTMLElement;

  onDragEnd = (result: DropResult) => {
    const {
      ordered: prevOrdered,
      columns: prevColumns,
      onChangeColumns,
      onChangeOrdering,
    } = this.props;
    if (result.combine) {
      if (result.type === 'COLUMN') {
        const shallow: string[] = [...prevOrdered];
        shallow.splice(result.source.index, 1);
        onChangeOrdering(shallow);
        return;
      }

      const column: Object[] = prevColumns[result.source.droppableId];
      const withTaskRemoved: Object[] = [...column];
      withTaskRemoved.splice(result.source.index, 1);
      const columns: Object = {
        ...prevColumns,
        [result.source.droppableId]: withTaskRemoved,
      };
      onChangeColumns(columns);
      return;
    }

    // dropped nowhere
    if (!result.destination) {
      return;
    }

    const { source } = result;
    const { destination } = result;

    // did not move anywhere - can bail early
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    // reordering column
    if (result.type === 'COLUMN') {
      const ordered: string[] = reorder(prevOrdered, source.index, destination.index);

      onChangeOrdering(ordered);

      return;
    }

    const data = reorderMilestoneMap({
      milestoneMap: prevColumns,
      source,
      destination,
    });

    onChangeColumns(data.milestoneMap);
  };

  render() {
    const { columns, ordered, editable } = this.props;

    const board = (
      <Droppable droppableId="board" type="COLUMN" direction="horizontal" ignoreContainerClipping>
        {(provided: DroppableProvided) => (
          <div
            className={MilestonesSectionWrapperStyle}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {ordered.map((key: string, index: number) => (
              <MilestoneColumn key={key} index={index} id={key} tasks={columns[key]} />
            ))}
            {provided.placeholder}
            {editable.createMilestone && (
              <Subscribe to={[ProjectMilestonesContainer]}>
                {({ newMilestone }) => {
                  return <NewButtonColumn onCreate={newMilestone} />;
                }}
              </Subscribe>
            )}
          </div>
        )}
      </Droppable>
    );

    return <DragDropContext onDragEnd={this.onDragEnd}>{board}</DragDropContext>;
  }
}