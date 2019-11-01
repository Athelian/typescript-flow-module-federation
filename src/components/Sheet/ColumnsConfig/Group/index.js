// @flow
import * as React from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import Icon from 'components/Icon';
import CheckboxInput from 'components/Form/CheckboxInput';
import type { ColumnState } from '../types';
import {
  WrapperStyle,
  LeftWrapperStyle,
  IconStyle,
  ColumnsWrapperStyle,
  ColumnStyle,
} from './style';

type Props = {
  icon: string,
  columns: Array<ColumnState>,
  onChange: (Array<ColumnState>) => void,
};

const Group = ({ icon, columns, onChange }: Props) => {
  const handleReorder = result => {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const reorder = Array.from(columns);
    const [removed] = reorder.splice(result.source.index, 1);
    reorder.splice(result.destination.index, 0, removed);

    onChange(reorder);
  };

  const handleToggle = (index: number) => {
    onChange(
      columns.map((column, idx) =>
        idx === index
          ? {
              ...column,
              hidden: !column.hidden,
            }
          : column
      )
    );
  };

  return (
    <div className={WrapperStyle}>
      <div className={LeftWrapperStyle}>
        <div className={IconStyle(icon)}>
          <Icon icon={icon} />
        </div>
      </div>

      <DragDropContext onDragEnd={handleReorder}>
        <Droppable droppableId={icon}>
          {dropProvided => (
            <div
              {...dropProvided.droppableProps}
              ref={dropProvided.innerRef}
              className={ColumnsWrapperStyle}
            >
              {columns.map((column, index) => (
                <Draggable key={column.column.key} draggableId={column.column.key} index={index}>
                  {(dragProvided, snapshot) => (
                    <div
                      ref={dragProvided.innerRef}
                      {...dragProvided.draggableProps}
                      {...dragProvided.dragHandleProps}
                      style={dragProvided.draggableProps.style}
                      className={ColumnStyle(snapshot.isDragging)}
                    >
                      <i>
                        <Icon icon="DRAG_HANDLE" />
                      </i>
                      <CheckboxInput
                        checked={!column.hidden}
                        onToggle={(e: SyntheticEvent<HTMLButtonElement>) => {
                          e.stopPropagation();
                          handleToggle(index);
                        }}
                      />
                      <span>{column.column.title}</span>
                    </div>
                  )}
                </Draggable>
              ))}
              {dropProvided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default Group;
