// @flow
import React from 'react';
import { sumBy } from 'lodash';
import { isNullOrUndefined } from 'utils/fp';
import { Blackout } from 'components/Form';
import type { TaskRingDataProps } from 'components/TaskRing/type.js.flow';
import BasicTaskRing from './components/BasicTaskRing';

type OptionalProps = {
  taskCount: TaskRingDataProps,
  blackout: boolean,
  tasks?: Array<Object>,
  size: number,
};

type Props = OptionalProps;

const defaultProps = {
  taskCount: {
    completed: 0,
    inProgress: 0,
    remain: 0,
    skipped: 0,
  },
  blackout: false,
  size: 20,
};

const calculateTasks = (tasks: Array<Object>) => ({
  completed: sumBy(tasks, task => (isNullOrUndefined(task.completedAt) ? 0 : 1)),
  inProgress: sumBy(tasks, task =>
    isNullOrUndefined(task.completedAt) && !isNullOrUndefined(task.inProgressAt) ? 1 : 0
  ),
  remain: sumBy(tasks, task =>
    isNullOrUndefined(task.completedAt) &&
    isNullOrUndefined(task.inProgressAt) &&
    isNullOrUndefined(task.skippedAt)
      ? 1
      : 0
  ),
  skipped: sumBy(tasks, task => (isNullOrUndefined(task.skippedAt) ? 0 : 1)),
});

const TaskRing = ({ taskCount, tasks, blackout, size }: Props) => {
  if (blackout) return <Blackout width="20px" height="20px" />;
  return tasks ? (
    <BasicTaskRing taskCount={calculateTasks(tasks)} size={size} />
  ) : (
    <BasicTaskRing taskCount={taskCount} size={size} />
  );
};

TaskRing.defaultProps = defaultProps;

export default TaskRing;
