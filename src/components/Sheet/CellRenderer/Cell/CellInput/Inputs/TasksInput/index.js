// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import FormattedNumber from 'components/FormattedNumber';
import DisplayWrapper from 'components/Sheet/CellRenderer/Cell/CellDisplay/Displays/DisplayWrapper';
import type { TaskPayload, TaskTemplatePayload } from 'generated/graphql';
import type InputProps from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import TasksInputDialog from './TasksInputDialog';
import { TasksInputWrapperStyle, TasksCountWrapperStyle, TaskIconStyle } from './style';

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
