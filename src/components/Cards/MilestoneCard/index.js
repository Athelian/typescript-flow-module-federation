// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Display, FieldItem, Label } from 'components/Form';
import FormattedDateTZ from 'components/FormattedDateTZ';
import FormattedNumber from 'components/FormattedNumber';
import TaskStatusChart from 'components/TaskStatusChart';
import Icon from 'components/Icon';
import withForbiddenCard from 'hoc/withForbiddenCard';
import useUser from 'hooks/useUser';
import BaseCard from '../BaseCard';
import {
  MilestoneCardStyle,
  MilestoneNameStyle,
  CommonCardGridStyle,
  TaskStatusChartStyle,
  MilestoneStatusWrapperStyle,
  MilestoneStatusIconStyle,
} from './style';

type Props = {
  milestone: {
    name: string,
    dueDate: string,
    taskCount: {
      count: number,
      remain: number,
      inProgress: number,
      skipped: number,
      completed: number,
      delayed: number,
    },
    completedAt: string,
  },
};

const MilestoneCard = ({ milestone, ...rest }: Props) => {
  const { user } = useUser();
  const { name, dueDate, taskCount = {}, completedAt } = milestone;
  const { count, remain, inProgress, skipped, completed, delayed } = taskCount;

  return (
    <BaseCard icon="MILESTONE" color="MILESTONE" {...rest}>
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
                <FormattedDateTZ value={dueDate} user={user} />
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
                <FormattedNumber value={count} />
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
                <FormattedNumber value={delayed} />
              </Display>
            }
          />

          <div className={TaskStatusChartStyle}>
            <TaskStatusChart
              completed={completed}
              inProgress={inProgress}
              skipped={skipped}
              unCompleted={remain}
            />
          </div>

          {completedAt ? (
            <>
              <div className={MilestoneStatusWrapperStyle(true)}>
                <FormattedMessage id="components.cards.completed" defaultMessage="COMPLETED" />

                <div className={MilestoneStatusIconStyle}>
                  <Icon icon="CHECKED" />
                </div>
              </div>
            </>
          ) : (
            <div className={MilestoneStatusWrapperStyle(false)}>
              <FormattedMessage id="components.card.unCompleted" defaultMessage="UNCOMPLETED" />
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
