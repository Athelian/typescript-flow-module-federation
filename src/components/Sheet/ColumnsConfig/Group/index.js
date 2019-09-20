// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import Icon from 'components/Icon';
import { BaseButton } from 'components/Buttons';
import CheckboxInput from 'components/Form/CheckboxInput';
import messages from '../../messages';
import type { ColumnState } from '../types';
import {
  WrapperStyle,
  LeftWrapperStyle,
  IconStyle,
  ColumnsWrapperStyle,
  ActionsWrapperStyle,
  ColumnStyle,
} from './style';

type Props = {
  icon: string,
  columns: Array<ColumnState>,
  onChange: (Array<ColumnState>) => void,
  onReset: () => void,
};

const Group = ({ icon, columns, onChange, onReset }: Props) => {
  const handleGrouped = () => {
    onChange(
      columns.sort((a, b) => {
        if (a.hidden && !b.hidden) {
          return 1;
        }

        if (!a.hidden && b.hidden) {
          return -1;
        }

        return 0;
      })
    );
  };

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
    <div className={WrapperStyle(icon)}>
      <div className={LeftWrapperStyle}>
        <div className={IconStyle(icon)}>
          <Icon icon={icon} />
        </div>

        <div className={ActionsWrapperStyle}>
          <BaseButton
            onClick={handleGrouped}
            label={<FormattedMessage {...messages.columnsConfigGroupButton} />}
            icon="BRING_FORWARD"
            textColor="TEAL"
            hoverTextColor="WHITE"
            backgroundColor="GRAY_SUPER_LIGHT"
            hoverBackgroundColor="TEAL"
          />
          <BaseButton
            onClick={onReset}
            label={<FormattedMessage {...messages.columnsConfigDefaultButton} />}
            icon="UNDO"
            textColor="GRAY_DARK"
            hoverTextColor="WHITE"
            backgroundColor="GRAY_SUPER_LIGHT"
            hoverBackgroundColor="GRAY_LIGHT"
          />
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
              {columns.map((column, index) => {
                return (
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
                );
              })}
              {dropProvided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default Group;
