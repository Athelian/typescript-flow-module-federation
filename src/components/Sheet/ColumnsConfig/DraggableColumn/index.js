// @flow
import * as React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import Icon from 'components/Icon';
import CheckboxInput from 'components/Form/CheckboxInput';
import type { ColumnConfig } from '../../SheetState/types';
import { ColumnStyle } from './style';

type Props = {
  index: number,
  column: ColumnConfig,
  onToggle: (index: number) => void,
};

const DraggableColumn = ({ index, column, onToggle }: Props) => (
  <Draggable draggableId={column.key} index={index}>
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
            onToggle(index);
          }}
        />
        <span>{column.title}</span>
      </div>
    )}
  </Draggable>
);

export default DraggableColumn;
