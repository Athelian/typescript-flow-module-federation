// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Draggable } from 'react-beautiful-dnd';
import Icon from 'components/Icon';
import { CheckboxInput, Label } from 'components/Form';
import type { ColumnConfig } from 'components/Sheet';
import { ColumnWrapperStyle, DragHandleStyle } from '../DraggableColumn/style';
import { InnerColumnsWrapperStyle, InnerColumnStyle, NewLabelStyle } from './style';

type Props = {|
  columns: Array<ColumnConfig>,
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
        className={ColumnWrapperStyle(snapshot.isDragging)}
      >
        <i className={DragHandleStyle(snapshot.isDragging)}>
          <Icon icon="DRAG_HANDLE" />
        </i>

        <div className={InnerColumnsWrapperStyle}>
          {columns.map(({ key, title, hidden, isNew }) => (
            <div key={key} className={InnerColumnStyle}>
              <CheckboxInput
                checked={!hidden}
                onToggle={(e: SyntheticEvent<HTMLButtonElement>) => {
                  e.stopPropagation();
                  onToggle(key);
                }}
              />

              <Label height="30px">{title}</Label>
              {isNew && (
                <div className={NewLabelStyle}>
                  <FormattedMessage id="components.new" defaultMessage="New" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )}
  </Draggable>
);

export default DraggableColumns;
