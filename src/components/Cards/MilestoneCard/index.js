// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
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
      completed: number,
      delayed: number,
    },
    completedAt: string,
  },
};

const MilestoneCard = ({ milestone }: Props) => {
  const { name, dueDate, taskCount, completedAt } = milestone;
  const { count, remain, inProgress, completed, delayed } = taskCount;

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
              // FIXME: wait for API, ref: https://zenport.slack.com/archives/C2JTDSRJ6/p1560920001006800
              skipped={0}
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
