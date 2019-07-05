// @flow
import { sumBy } from 'lodash';
import type { User, Task } from 'generated/graphql';
import { isBefore } from 'date-fns';
import { getByPathWithDefault } from 'utils/fp';

const isCompletedTask = (task: Task) => {
  return getByPathWithDefault('', 'completedAt', task);
};
const isRejectedTask = (task: Task) => {
  return getByPathWithDefault('', 'rejectedAt', task);
};
const isApprovedTask = (task: Task) => {
  return getByPathWithDefault('', 'approvedAt', task);
};
const isDelayedTask = (task: Task) => {
  return (
    !getByPathWithDefault('', 'completedAt', task) &&
    !getByPathWithDefault('', 'skippedAt', task) &&
    getByPathWithDefault('', 'dueDate', task) &&
    isBefore(new Date(getByPathWithDefault('', 'dueDate', task)), new Date())
  );
};
const isUnApprovedTask = (task: Task) => {
  return (
    getByPathWithDefault('', 'approvable', task) &&
    !getByPathWithDefault('', 'rejectedAt', task) &&
    !getByPathWithDefault('', 'approvedAt', task)
  );
};
const isInProgressTask = (task: Task) => {
  return (
    !getByPathWithDefault('', 'completedAt', task) && getByPathWithDefault('', 'inProgressAt', task)
  );
};
const isRemainTask = (task: Task) => {
  return (
    !getByPathWithDefault('', 'completedAt', task) &&
    !getByPathWithDefault('', 'inProgressAt', task) &&
    !getByPathWithDefault('', 'skippedAt', task)
  );
};
const isSkippedTask = (task: Task) => {
  return getByPathWithDefault('', 'skippedAt', task);
};
export function calculateTasks(tasks: Array<Task>) {
  return {
    count: tasks.length,
    completed: sumBy(tasks, task => (isCompletedTask(task) ? 1 : 0)),
    rejected: sumBy(tasks, task => (isRejectedTask(task) ? 1 : 0)),
    approved: sumBy(tasks, task => (isApprovedTask(task) ? 1 : 0)),
    delayed: sumBy(tasks, task => (isDelayedTask(task) ? 1 : 0)),
    unapproved: sumBy(tasks, task => (isUnApprovedTask(task) ? 1 : 0)),
    inProgress: sumBy(tasks, task => (isInProgressTask(task) ? 1 : 0)),
    remain: sumBy(tasks, task => (isRemainTask(task) ? 1 : 0)),
    skipped: sumBy(tasks, task => (isSkippedTask(task) ? 1 : 0)),
  };
}
export const setToSkipTask = (
  task: Task,
  {
    completedBy,
    completedAt,
  }: {
    completedBy: ?User,
    completedAt: ?Date,
  }
) => {
  if (isRemainTask(task)) return { ...task, skippedBy: completedBy, skippedAt: completedAt };
  if (isInProgressTask(task))
    return {
      ...task,
      skippedBy: completedBy,
      skippedAt: completedAt,
      inProgressBy: null,
      inProgressAt: null,
    };
  return task;
};
export const setToComplete = (
  task: Task,
  {
    completedBy,
    completedAt,
  }: {
    completedBy: ?User,
    completedAt: ?Date,
  }
) => {
  if (isRemainTask(task) || isInProgressTask(task))
    return {
      ...task,
      completedBy,
      completedAt,
      inProgressBy: completedBy,
      inProgressAt: completedAt,
    };
  return task;
};
