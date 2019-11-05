// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import FormattedNumber from 'components/FormattedNumber';
import DisplayWrapper from 'components/Sheet/CellRenderer/Cell/CellDisplay/Displays/DisplayWrapper';
import type { TaskPayload, TaskTemplatePayload } from 'generated/graphql';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import TasksInputDialog from './TasksInputDialog';
import {
  TasksInputWrapperStyle,
  TasksCountWrapperStyle,
  TaskIconStyle,
  TasksChartWrapperStyle,
  NumCompletedStyle,
  TasksBarWrapperStyle,
  TasksBarStyle,
} from './style';

type Todo = {
  tasks: Array<TaskPayload>,
  taskTemplate: TaskTemplatePayload,
};

type Context = {
  entityId: string,
  groupIds: Array<string>,
};

const TasksInput = (entityType: string) => {
  return ({
    value = { tasks: [], taskTemplate: null },
    context: { entityId, groupIds },
    focus,
    readonly,
    onChange,
    forceFocus,
    forceBlur,
  }: InputProps<Todo, Context>) => {
    const numCompletedOrSkipped = value.tasks.reduce(
      (num, task) =>
        num + (task.completedAt || task.completedBy || task.skippedAt || task.skippedBy) ? 1 : 0,
      0
    );
    const completedOrSkippedPercentage =
      value.tasks.length > 0 ? numCompletedOrSkipped / value.tasks.length : 0;

    const handleBlur = (e: SyntheticFocusEvent<HTMLElement>) => {
      if (focus) {
        e.stopPropagation();
        e.preventDefault();
      }
    };

    return (
      <div onBlur={handleBlur}>
        <button
          disabled={readonly}
          onClick={forceFocus}
          type="button"
          className={TasksInputWrapperStyle}
        >
          <div className={TaskIconStyle}>
            <Icon icon="TASK" />
          </div>

          <div className={TasksCountWrapperStyle}>
            <DisplayWrapper>
              <span>
                {value.tasks.length === 1 ? (
                  <FormattedMessage
                    id="modules.sheet.task"
                    defaultMessage="{numOfTasks} Task"
                    values={{ numOfTasks: <FormattedNumber value={value.tasks.length} /> }}
                  />
                ) : (
                  <FormattedMessage
                    id="modules.sheet.tasks"
                    defaultMessage="{numOfTasks} Tasks"
                    values={{ numOfTasks: <FormattedNumber value={value.tasks.length} /> }}
                  />
                )}
              </span>
            </DisplayWrapper>
          </div>

          <div className={TasksChartWrapperStyle}>
            <div className={NumCompletedStyle}>
              <FormattedMessage
                id="modules.sheet.tasksCompletedOrSkipped"
                defaultMessage="{numOfTasks} Completed / Skipped"
                values={{ numOfTasks: <FormattedNumber value={numCompletedOrSkipped} /> }}
              />
            </div>
            <div className={TasksBarWrapperStyle}>
              <div className={TasksBarStyle(completedOrSkippedPercentage)} />
            </div>
          </div>
        </button>

        <TasksInputDialog
          tasks={value?.tasks || []}
          taskTemplate={value?.taskTemplate}
          onChange={onChange}
          onClose={forceBlur}
          open={focus}
          entityType={entityType}
          entityId={entityId}
          groupIds={groupIds}
        />
      </div>
    );
  };
};

export default {
  Order: TasksInput('Order'),
  OrderItem: TasksInput('OrderItem'),
  Batch: TasksInput('Batch'),
  Shipment: TasksInput('Shipment'),
};
