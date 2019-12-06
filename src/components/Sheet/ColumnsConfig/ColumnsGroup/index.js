// @flow
import * as React from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import Icon from 'components/Icon';
import type { ColumnConfig } from 'components/Sheet/SheetState/types';
import DraggableColumn from '../DraggableColumn';
import { ColumnsWrapperStyle, IconStyle, LeftWrapperStyle, WrapperStyle } from './style';

type Props = {
  icon: string,
  columns: Array<ColumnConfig>,
  onChange: (Array<ColumnConfig>) => void,
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

  const handleToggle = (index: number) => {
    onChange(
      columns.map((column, idx) => (idx === index ? { ...column, hidden: !column.hidden } : column))
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
                <DraggableColumn
                  key={column.key}
                  index={index}
                  column={column}
                  onToggle={handleToggle}
                />
              ))}
              {dropProvided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default ColumnsGroup;
