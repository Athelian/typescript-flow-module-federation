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
};

type Props = OptionalProps;

const defaultProps = {
  completedCount: 0,
  inProgressCount: 0,
  remainingCount: 0,
  blackout: false,
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

const TaskRing = ({ completedCount, inProgressCount, remainingCount, tasks, blackout }: Props) => {
  if (blackout) return <Blackout width="20px" height="20px" />;
  return tasks ? (
    <BasicTaskRing {...calculateTasks(tasks)} />
  ) : (
    <BasicTaskRing
      completedCount={completedCount}
      inProgressCount={inProgressCount}
      remainingCount={remainingCount}
    />
  );
};

TaskRing.defaultProps = defaultProps;

export default TaskRing;
