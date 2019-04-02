// @flow
import React from 'react';
import { sumBy } from 'lodash';
import { isNullOrUndefined } from 'utils/fp';
import { Blackout } from 'components/Form';
import type { TaskRingDataProps } from 'components/TaskRing/type.js.flow';
import BasicTaskRing from './components/BasicTaskRing';

type OptionalProps = TaskRingDataProps & {
  blackout?: boolean,
  tasks?: Array<Object>,
  size: number,
};

type Props = OptionalProps;

const defaultProps = {
  completedCount: 0,
  inProgressCount: 0,
  remainingCount: 0,
  blackout: false,
  size: 20,
};

const calculateTasks = (tasks: Array<Object>) => ({
  completedCount: sumBy(tasks, task => (isNullOrUndefined(task.completedAt) ? 0 : 1)),
  inProgressCount: sumBy(tasks, task =>
    isNullOrUndefined(task.completedAt) && !isNullOrUndefined(task.inProgressAt) ? 1 : 0
  ),
  remainingCount: sumBy(tasks, task =>
    isNullOrUndefined(task.completedAt) && isNullOrUndefined(task.inProgressAt) ? 1 : 0
  ),
});

const TaskRing = ({
  completedCount,
  inProgressCount,
  remainingCount,
  tasks,
  blackout,
  size,
}: Props) => {
  if (blackout) return <Blackout width="20px" height="20px" />;
  return tasks ? (
    <BasicTaskRing {...calculateTasks(tasks)} size={size} />
  ) : (
    <BasicTaskRing
      completedCount={completedCount}
      inProgressCount={inProgressCount}
      remainingCount={remainingCount}
      size={size}
    />
  );
};

TaskRing.defaultProps = defaultProps;

export default TaskRing;
