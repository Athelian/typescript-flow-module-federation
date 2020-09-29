// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import type { UserPayload } from 'generated/graphql';
import FormattedDateTZ from 'components/FormattedDateTZ';
import Icon from 'components/Icon';
import { Label } from 'components/Form';
import { Tooltip, FullValueTooltip } from 'components/Tooltip';
import { calculatePercentage } from 'utils/ui';
import { calculateDateDifferenceInDays } from 'utils/date';
import MilestoneDueDateToolTip from '../MilestoneDueDateToolTip';
import {
  TimelineItemStyle,
  MilestoneNameStyle,
  ProgressBarStyle,
  BarStyle,
  MilestoneTickStyle,
  TasksWrapperStyle,
  CompletedTasksStyle,
  TotalTasksStyle,
  TaskIconStyle,
  MilestoneDatesWrapperStyle,
  MilestoneDateWrapperStyle,
  MilestoneDateStyle,
  MilestoneDiffDateStyle,
} from './style';

type Props = {
  milestone: Object,
  user: UserPayload,
};

const MilestoneTimelineItem = ({ milestone, user }: Props) => {
  const { name, dueDate, estimatedCompletionDate, completedAt, tasks = [] } = milestone;

  const isCompleted = completedAt;
  const total = tasks.length;
  const completedOrSkippedCount = tasks.filter(item => item.completedAt || item.skippedAt).length;

  let dueDateDiff = 0;
  if (dueDate && completedAt) {
    dueDateDiff = calculateDateDifferenceInDays(completedAt, dueDate);
  } else if (dueDate && estimatedCompletionDate) {
    dueDateDiff = calculateDateDifferenceInDays(estimatedCompletionDate, dueDate);
  }

  return (
    <div className={TimelineItemStyle}>
      <FullValueTooltip message={name}>
        <div className={MilestoneNameStyle}>{name}</div>
      </FullValueTooltip>

      <div className={ProgressBarStyle}>
        <div className={BarStyle(calculatePercentage(total, completedOrSkippedCount))} />
        <div className={MilestoneTickStyle(isCompleted)}>
          <Icon icon="CONFIRM" />
        </div>
      </div>

      <div className={TasksWrapperStyle}>
        <div className={CompletedTasksStyle(completedOrSkippedCount)}>
          {completedOrSkippedCount}
        </div>
        <div className={TotalTasksStyle}>{`\u00A0/ ${total}`}</div>
        <div className={TaskIconStyle}>
          <Icon icon="TASK" />
        </div>
      </div>

      <Tooltip
        message={
          <MilestoneDueDateToolTip
            dueDate={dueDate}
            estDate={estimatedCompletionDate}
            completedAt={completedAt}
            user={user}
          />
        }
      >
        <div className={MilestoneDatesWrapperStyle}>
          <div className={MilestoneDateWrapperStyle}>
            <Label width="65px" height="20px">
              <FormattedMessage id="components.card.due" defaultMessage="DUE" />
            </Label>

            <div className={MilestoneDateStyle(dueDate)}>
              {dueDate ? (
                <FormattedDateTZ value={dueDate} user={user} />
              ) : (
                <FormattedMessage id="component.cards.na" defaultMessage="N/A" />
              )}
            </div>
          </div>

          <div className={MilestoneDateWrapperStyle}>
            <Label width="65px" height="20px">
              {isCompleted ? (
                <FormattedMessage id="components.card.compl" defaultMessage="COMPL." />
              ) : (
                <FormattedMessage id="components.card.est" defaultMessage="EST." />
              )}
            </Label>

            <div className={MilestoneDateStyle(completedAt || estimatedCompletionDate)}>
              {isCompleted ? (
                <FormattedDateTZ value={completedAt} user={user} />
              ) : (
                <>
                  {estimatedCompletionDate ? (
                    <FormattedDateTZ value={estimatedCompletionDate} user={user} />
                  ) : (
                    <FormattedMessage id="component.cards.na" defaultMessage="N/A" />
                  )}
                </>
              )}

              <span className={MilestoneDiffDateStyle(dueDateDiff)}>
                {dueDateDiff > 0 && '+'}
                {dueDateDiff !== 0 && dueDateDiff}
              </span>
            </div>
          </div>
        </div>
      </Tooltip>
    </div>
  );
};

export default MilestoneTimelineItem;
