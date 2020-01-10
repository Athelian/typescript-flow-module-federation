// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Draggable } from 'react-beautiful-dnd';
import Icon from 'components/Icon';
import { CheckboxInput, Label } from 'components/Form';
import { ColumnWrapperStyle, DragHandleStyle, CheckboxWrapperStyle, NewLabelStyle } from './style';

export type Column = {
  title: React$Node,
  hidden?: boolean,
  isNew?: boolean,
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
        className={ColumnWrapperStyle(snapshot.isDragging)}
      >
        <i className={DragHandleStyle(snapshot.isDragging)}>
          <Icon icon="DRAG_HANDLE" />
        </i>

        <div className={CheckboxWrapperStyle}>
          <CheckboxInput
            checked={!column.hidden}
            onToggle={(e: SyntheticEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              onToggle(column.key);
            }}
          />
        </div>

        <Label height="30px">{column.title}</Label>
        {column.isNew && (
          <div className={NewLabelStyle}>
            <FormattedMessage id="components.new" defaultMessage="New" />
          </div>
        )}
      </div>
    )}
  </Draggable>
);

export default DraggableColumn;
