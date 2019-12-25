// @flow
import * as React from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { FormattedMessage } from 'react-intl';
import { DefaultStyle, Label } from 'components/Form';
import Icon from 'components/Icon';
import NumberInput from 'components/Inputs/NumberInput';
import DraggableColumn from 'components/DraggableColumn';
import type { ColumnConfig } from 'components/Sheet';
import messages from 'modules/project/messages';
import { generateMilestoneTaskColumns, computeMilestoneTaskColumnsTemplate } from '../columns';
import {
  IconStyle,
  IconWrapperStyle,
  GroupWrapperStyle,
  WrapperStyle,
  ColumnsWrapperStyle,
  InputWrapperStyle,
} from './style';

type Props = {
  columns: Array<ColumnConfig>,
  onChange: (Array<ColumnConfig>) => void,
};

const handleReorder = (array: Array<any>, result): Array<any> => {
  if (!result.destination) {
    return array;
  }

  if (result.destination.index === result.source.index) {
    return array;
  }

  const reorder = [...array];
  const [removed] = reorder.splice(result.source.index, 1);
  reorder.splice(result.destination.index, 0, removed);

  return reorder;
};

const MilestoneTaskColumnsConfigGroup = ({ columns, onChange }: Props) => {
  const {
    milestoneColumnsTemplate,
    taskColumnsTemplate,
    taskCount,
    milestoneCount,
  } = React.useMemo(() => computeMilestoneTaskColumnsTemplate(columns), [columns]);

  const handleReorderMilestone = result =>
    onChange(
      generateMilestoneTaskColumns(
        handleReorder(milestoneColumnsTemplate, result),
        milestoneCount,
        taskColumnsTemplate,
        taskCount
      )
    );
  const handleReorderTask = result =>
    onChange(
      generateMilestoneTaskColumns(
        milestoneColumnsTemplate,
        milestoneCount,
        handleReorder(taskColumnsTemplate, result),
        taskCount
      )
    );

  const handleToggleMilestone = (columnKey: string) => {
    onChange(
      generateMilestoneTaskColumns(
        milestoneColumnsTemplate.map(column =>
          columnKey === column.key ? { ...column, hidden: !column.hidden } : column
        ),
        milestoneCount,
        taskColumnsTemplate,
        taskCount
      )
    );
  };

  const handleToggleTask = (columnKey: string) => {
    onChange(
      generateMilestoneTaskColumns(
        milestoneColumnsTemplate,
        milestoneCount,
        taskColumnsTemplate.map(column =>
          columnKey === column.key ? { ...column, hidden: !column.hidden } : column
        ),
        taskCount
      )
    );
  };

  const handleChangeMilestoneCount = (evt: SyntheticInputEvent<HTMLInputElement>) => {
    onChange(
      generateMilestoneTaskColumns(
        milestoneColumnsTemplate,
        Math.max(1, parseFloat(evt.target.value || 0)),
        taskColumnsTemplate,
        taskCount
      )
    );
  };

  const handleChangeTaskCount = (evt: SyntheticInputEvent<HTMLInputElement>) => {
    onChange(
      generateMilestoneTaskColumns(
        milestoneColumnsTemplate,
        milestoneCount,
        taskColumnsTemplate,
        Math.max(1, parseFloat(evt.target.value || 0))
      )
    );
  };

  return (
    <div className={WrapperStyle}>
      <div className={GroupWrapperStyle}>
        <div className={IconWrapperStyle}>
          <div className={IconStyle('MILESTONE')}>
            <Icon icon="MILESTONE" />
            <div className={InputWrapperStyle}>
              <Label>
                <FormattedMessage {...messages.repeat} />
              </Label>
              <DefaultStyle width="100px" height="30px">
                <NumberInput
                  value={milestoneCount}
                  onChange={handleChangeMilestoneCount}
                  min={1}
                  required
                />
              </DefaultStyle>
            </div>
          </div>
        </div>

        <DragDropContext onDragEnd={handleReorderMilestone}>
          <Droppable droppableId="MILESTONE">
            {dropProvided => (
              <div
                {...dropProvided.droppableProps}
                ref={dropProvided.innerRef}
                className={ColumnsWrapperStyle}
              >
                {milestoneColumnsTemplate.map((column, index) => (
                  <DraggableColumn
                    key={column.key}
                    index={index}
                    column={column}
                    onToggle={handleToggleMilestone}
                  />
                ))}
                {dropProvided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <div className={GroupWrapperStyle}>
        <div className={IconWrapperStyle}>
          <div className={IconStyle('TASK')}>
            <Icon icon="TASK" />
            <div className={InputWrapperStyle}>
              <Label>
                <FormattedMessage {...messages.repeat} />
              </Label>
              <DefaultStyle width="100px" height="30px">
                <NumberInput value={taskCount} onChange={handleChangeTaskCount} min={1} required />
              </DefaultStyle>
            </div>
          </div>
        </div>

        <DragDropContext onDragEnd={handleReorderTask}>
          <Droppable droppableId="TASK">
            {dropProvided => (
              <div
                {...dropProvided.droppableProps}
                ref={dropProvided.innerRef}
                className={ColumnsWrapperStyle}
              >
                {taskColumnsTemplate.map((column, index) => (
                  <DraggableColumn
                    key={column.key}
                    index={index}
                    column={column}
                    onToggle={handleToggleTask}
                  />
                ))}
                {dropProvided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

export default MilestoneTaskColumnsConfigGroup;
