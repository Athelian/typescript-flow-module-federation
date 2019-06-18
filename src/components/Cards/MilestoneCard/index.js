// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { isBefore, startOfToday } from 'utils/date';
import { Display, FieldItem, Label } from 'components/Form';
import FormattedDate from 'components/FormattedDate';
import FormattedNumber from 'components/FormattedNumber';
import TaskStatusChart from 'components/TaskStatusChart';
import Icon from 'components/Icon';
import withForbiddenCard from 'hoc/withForbiddenCard';

import BaseCard from '../BaseCard';
import {
  MilestoneCardStyle,
  MilestoneNameStyle,
  CommonCardGridStyle,
  TaskStatusChartStyle,
  MilestoneStatusWrapperStyle,
} from './style';

type Props = {
  milestone: {
    name: string,
    dueDate: string,
    tasks: Array<Object>,
    completedAt: string,
  },
};

export const calculateTasksCompletion = (tasks: Array<Object>) => {
  let completed = 0;
  let inProgress = 0;
  let skipped = 0;
  let unCompleted = 0;
  let overdueTasks = 0;
  tasks.forEach(task => {
    const { completedAt, inProgressAt, skippedAt, dueDate } = task;
    if (isBefore(new Date(dueDate), startOfToday())) {
      overdueTasks += 1;
    }

    if (completedAt) {
      completed += 1;
    } else if (inProgressAt) {
      inProgress += 1;
    } else if (skippedAt) {
      skipped += 1;
    } else {
      unCompleted += 1;
    }
  });
  return {
    completed,
    inProgress,
    skipped,
    unCompleted,
    overdueTasks,
  };
};

const MilestoneCard = ({ milestone }: Props) => {
  const { name, dueDate, tasks = [], completedAt } = milestone;

  const { completed, inProgress, skipped, unCompleted, overdueTasks } = calculateTasksCompletion(
    tasks
  );

  return (
    <BaseCard icon="MILESTONE" color="MILESTONE">
      <div className={MilestoneCardStyle}>
        <div className={CommonCardGridStyle}>
          <div className={MilestoneNameStyle}>
            <Display align="left">{name}</Display>
          </div>

          <FieldItem
            label={
              <Label>
                <FormattedMessage id="components.cards.dueDate" defaultMessage="DUE DATE" />
              </Label>
            }
            input={
              <Display>
                <FormattedDate value={dueDate} />
              </Display>
            }
          />

          <FieldItem
            label={
              <Label>
                <FormattedMessage id="components.cards.tasks" defaultMessage="TASKS" />
              </Label>
            }
            input={
              <Display>
                <FormattedNumber value={tasks.length} />
              </Display>
            }
          />

          <FieldItem
            label={
              <Label>
                <FormattedMessage id="components.cards.overdue" defaultMessage="OVERDUE" />
              </Label>
            }
            input={
              <Display>
                <FormattedNumber value={overdueTasks} />
              </Display>
            }
          />

          <div className={TaskStatusChartStyle}>
            <TaskStatusChart
              completed={completed}
              inProgress={inProgress}
              skipped={skipped}
              unCompleted={unCompleted}
            />
          </div>

          {completedAt ? (
            <div className={MilestoneStatusWrapperStyle(true)}>
              <FormattedMessage id="components.cards.completed" defaultMessage="COMPLETED" />
              <Icon icon="CLEAR" />
            </div>
          ) : (
            <div className={MilestoneStatusWrapperStyle(false)}>
              <FormattedMessage id="components.card.unCompleted" defaultMessage="UNCOMPLETED" />
              <Icon icon="CHECKED" />
            </div>
          )}
        </div>
      </div>
    </BaseCard>
  );
};

export default withForbiddenCard(MilestoneCard, 'milestone', {
  width: '195px',
  height: '204px',
  entityIcon: 'MILESTONE',
  entityColor: 'MILESTONE',
});
