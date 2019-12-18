// @flow
import * as React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import Icon from 'components/Icon';
import CheckboxInput from 'components/Form/CheckboxInput';
import { ColumnStyle } from './style';

export type Column = {
  title: React$Node,
  hidden?: boolean,
  key: string,
};

type Props = {|
  column: Column,
  onToggle: (selectedKey: string) => void,
  index: number,
|};

const DraggableColumn = ({ column, onToggle, index }: Props) => (
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
            onToggle(column.key);
          }}
        />
        <span>{column.title}</span>
      </div>
    )}
  </Draggable>
);

export default DraggableColumn;
