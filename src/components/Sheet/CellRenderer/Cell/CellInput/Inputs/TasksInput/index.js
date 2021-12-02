// @flow
import * as React from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import { FormattedMessage } from 'react-intl';
import LoadingIcon from 'components/LoadingIcon';
import Icon from 'components/Icon';
import FormattedNumber from 'components/FormattedNumber';
import type { TaskPayload, TaskTemplatePayload } from 'generated/graphql';
import type { InputProps } from 'components/Sheet/CellRenderer/Cell/CellInput/types';
import {
  CellDisplayWrapperStyle,
  DisplayContentStyle,
} from 'components/Sheet/CellRenderer/Cell/CellDisplay/Common/style';
import TasksInputDialog from './TasksInputDialog';
import { getTaskQuery, getTasksFromQueryData } from './helpers';
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

type Extra = {|
  entityType: string,
|};

const TasksInput = ({
  value,
  context,
  focus,
  readonly,
  onChange,
  forceFocus,
  forceBlur,
  extra,
}: InputProps<Todo, Context, Extra>) => {
  const { entityType }: Object = extra;
  const summaryTasks = value?.tasks ?? [];

  const entityId = context?.entityId ?? '';
  const ownerId = context?.ownerId ?? '';
  const groupIds = context?.groupIds ?? [];
  const [tasks, setTasks] = React.useState<Array<TaskPayload>>([]);
  const [taskTemplate, setTaskTemplate] = React.useState(null);
  const [isOpen, setOpen] = React.useState(false);

  const [getTasks, { loading }] = useLazyQuery(getTaskQuery(entityType), {
    onCompleted: newData => {
      const { tasks: newTasks, taskTemplate: newTaskTemplate } = getTasksFromQueryData(
        entityType,
        newData
      );
      setTasks(newTasks);
      setTaskTemplate(newTaskTemplate);
      setOpen(true);
    },
  });

  const numCompletedOrSkipped = summaryTasks.reduce(
    (num, task) =>
      num +
      Number((!!task.completedAt && !!task.completedBy) || (!!task.skippedAt && !!task.skippedBy)),
    0
  );
  const completedOrSkippedPercentage =
    summaryTasks.length > 0 ? numCompletedOrSkipped / summaryTasks.length : 0;

  const handleBlur = (e: SyntheticFocusEvent<HTMLElement>) => {
    if (focus) {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  React.useEffect(() => {
    if (focus) {
      getTasks({
        variables: {
          ids: [entityId],
        },
      });
    } else {
      setOpen(false);
      forceBlur();
    }
    // forceBlur is already memoized high up in the parent tree
  }, [focus, entityId, getTasks, forceBlur]);

  return (
    <div onBlur={handleBlur}>
      <button
        disabled={readonly}
        onClick={forceFocus}
        type="button"
        className={TasksInputWrapperStyle}
      >
        <div className={TaskIconStyle}>
          {loading && <LoadingIcon size={10} />}
          {!loading && <Icon icon="TASK" />}
        </div>

        <div className={TasksCountWrapperStyle}>
          <div className={CellDisplayWrapperStyle}>
            <span className={DisplayContentStyle}>
              {summaryTasks.length === 1 ? (
                <FormattedMessage
                  id="modules.sheet.task"
                  defaultMessage="{numOfTasks} Task"
                  values={{ numOfTasks: <FormattedNumber value={summaryTasks.length} /> }}
                />
              ) : (
                <FormattedMessage
                  id="modules.sheet.tasks"
                  defaultMessage="{numOfTasks} Tasks"
                  values={{ numOfTasks: <FormattedNumber value={summaryTasks.length} /> }}
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
        onChange={({ taskTemplate: newTaskTemplate, tasks: newTasks }) => {
          setTasks(newTasks);
          setTaskTemplate(newTaskTemplate ?? null);
        }}
        onClose={() => {
          forceBlur();
          setOpen(false);
          onChange({ tasks, taskTemplate }, true);
        }}
        open={isOpen}
        entityType={entityType}
        entityId={entityId}
        ownerId={ownerId}
        groupIds={groupIds}
      />
    </div>
  );
};

export default TasksInput;
