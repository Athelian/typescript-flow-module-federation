// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import FormattedNumber from 'components/FormattedNumber';
import type { TaskPayload, TaskTemplatePayload } from 'generated/graphql';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import {
  CellDisplayWrapperStyle,
  DisplayContentStyle,
} from 'components/Sheet/CellRenderer/Cell/CellDisplay/Common/style';
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
  taskTemplate: ?TaskTemplatePayload,
};

type Context = {|
  ownerId: string,
  entityId: string,
  groupIds: Array<string>,
|};

const TasksInput = (entityType: string) => {
  return ({
    value,
    context,
    focus,
    readonly,
    onChange,
    forceFocus,
    forceBlur,
  }: InputProps<Todo, Context>) => {
    const tasks = value?.tasks ?? [];
    const taskTemplate = value?.taskTemplate ?? null;
    const entityId = context?.entityId ?? '';
    const ownerId = context?.ownerId ?? '';
    const groupIds = context?.groupIds ?? [];

    const numCompletedOrSkipped = tasks.reduce(
      (num, task) =>
        num +
        Number(
          (!!task.completedAt && !!task.completedBy) || (!!task.skippedAt && !!task.skippedBy)
        ),
      0
    );
    const completedOrSkippedPercentage =
      tasks.length > 0 ? numCompletedOrSkipped / tasks.length : 0;

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
            <div className={CellDisplayWrapperStyle}>
              <span className={DisplayContentStyle}>
                {tasks.length === 1 ? (
                  <FormattedMessage
                    id="modules.sheet.task"
                    defaultMessage="{numOfTasks} Task"
                    values={{ numOfTasks: <FormattedNumber value={tasks.length} /> }}
                  />
                ) : (
                  <FormattedMessage
                    id="modules.sheet.tasks"
                    defaultMessage="{numOfTasks} Tasks"
                    values={{ numOfTasks: <FormattedNumber value={tasks.length} /> }}
                  />
                )}
              </span>
            </div>
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
          tasks={tasks}
          taskTemplate={taskTemplate}
          onChange={onChange}
          onClose={() => {
            onChange({ tasks, taskTemplate }, true);
            forceBlur();
          }}
          open={focus}
          entityType={entityType}
          entityId={entityId}
          ownerId={ownerId}
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
