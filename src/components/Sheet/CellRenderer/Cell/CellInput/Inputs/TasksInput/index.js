// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import FormattedNumber from 'components/FormattedNumber';
import DisplayWrapper from 'components/Sheet/CellRenderer/Cell/CellDisplay/Displays/DisplayWrapper';
import type { TaskPayload, TaskTemplatePayload } from 'generated/graphql';
import type InputProps from 'components/Sheet/CellRenderer/Cell/CellInput/types';
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

const TasksInput = (entityType: string) => {
  return ({
    value = { tasks: [], taskTemplate: null },
    focus,
    readonly,
    onChange,
    onBlur,
    onFocus,
  }: InputProps<{
    tasks: Array<TaskPayload>,
    taskTemplate: TaskTemplatePayload,
  }>) => {
    let numCompletedOrSkipped = 0;
    value.tasks.forEach(task => {
      if (task.completedAt || task.completedBy || task.skippedAt || task.skippedBy) {
        numCompletedOrSkipped += 1;
      }
    });
    const completedOrSkippedPercentage =
      value.tasks.length > 0 ? numCompletedOrSkipped / value.tasks.length : 0;

    return (
      <>
        <button
          tabIndex="-1"
          onClick={() => {
            if (!readonly) {
              onFocus();
            }
          }}
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
          onBlur={onBlur}
          focus={focus}
          entityType={entityType}
        />
      </>
    );
  };
};

export default {
  Order: TasksInput('Order'),
  OrderItem: TasksInput('OrderItem'),
  Batch: TasksInput('Batch'),
  Shipment: TasksInput('Shipment'),
};
