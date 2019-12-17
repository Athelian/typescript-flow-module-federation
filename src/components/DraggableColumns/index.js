// @flow
import * as React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import Icon from 'components/Icon';
import CheckboxInput from 'components/Form/CheckboxInput';
import { ColumnStyle } from '../DraggableColumn/style';
import type { Column } from '../DraggableColumn';

type Props = {|
  columns: Array<Column>,
  onToggle: (key: string) => void,
  index: number,
|};

const DraggableColumns = ({ columns, onToggle, index }: Props) => (
  <Draggable draggableId={columns?.[0]?.key} index={index}>
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
        <div>
          {columns.map(({ key, title, hidden }) => (
            <div key={key} className={ColumnStyle(snapshot.isDragging)}>
              <CheckboxInput
                checked={!hidden}
                onToggle={(e: SyntheticEvent<HTMLButtonElement>) => {
                  e.stopPropagation();
                  onToggle(key);
                }}
              />
              <span>{title}</span>
            </div>
          ))}
        </div>
      </div>
    )}
  </Draggable>
);

export default DraggableColumns;
