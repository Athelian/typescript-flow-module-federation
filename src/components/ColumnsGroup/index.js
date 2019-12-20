// @flow
import * as React from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import Icon from 'components/Icon';
import DraggableColumn from '../DraggableColumn';
import type { Column } from '../DraggableColumn';
import DraggableColumns from '../DraggableColumns';
import {
  ColumnsGroupWrapperStyle,
  LeftWrapperStyle,
  GroupIconStyle,
  ColumnsWrapperStyle,
} from './style';

type Props = {
  icon: string,
  columns: Array<Column | Array<Column>>,
  onChange: (Array<Column | Array<Column>>) => void,
};

const ColumnsGroup = ({ icon, columns, onChange }: Props) => {
  const handleReorder = result => {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const reorder = [...columns];
    const [removed] = reorder.splice(result.source.index, 1);
    reorder.splice(result.destination.index, 0, removed);

    onChange(reorder);
  };

  const handleToggle = (hiddenKey: string) => {
    const onToggle = col => (col.key === hiddenKey ? { ...col, hidden: !col.hidden } : col);
    onChange(
      columns.map(column =>
        Array.isArray(column) ? column.map(col => onToggle(col)) : onToggle(column)
      )
    );
  };

  return (
    <div className={ColumnsGroupWrapperStyle}>
      <div className={LeftWrapperStyle}>
        <div className={GroupIconStyle(icon)}>
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
              {columns.map((column, index) =>
                Array.isArray(column) ? (
                  <DraggableColumns
                    key={column?.[0]?.key}
                    index={index}
                    columns={column}
                    onToggle={handleToggle}
                  />
                ) : (
                  <DraggableColumn
                    key={column.key}
                    column={column}
                    onToggle={handleToggle}
                    index={index}
                  />
                )
              )}
              {dropProvided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default ColumnsGroup;
