// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import FormattedDate from 'components/FormattedDate';
import Icon from 'components/Icon';
import { Label } from 'components/Form';
import { Tooltip } from 'components/Tooltip';
import { calculatePercentage } from 'utils/ui';
import { isNullOrUndefined } from 'utils/fp';
import { differenceInCalendarDays } from 'utils/date';
import MilestoneDueDateToolTip from '../MilestoneDueDateToolTip';
import {
  TimelineStyle,
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
};

const MilestoneBlock = ({ milestone }: Props) => {
  // TODO: Replace estCompletedAt with real data
  const { name, dueDate, estCompletedAt, completedAt, tasks = [] } = milestone;

  const isCompleted = !isNullOrUndefined(completedAt);
  const total = tasks.length;
  const completed = tasks.filter(item => isNullOrUndefined(item.completedAt)).length;

  let dueDateDiff = 0;
  if (dueDate && completedAt) {
    dueDateDiff = differenceInCalendarDays(new Date(completedAt), new Date(dueDate));
  } else if (dueDate && estCompletedAt) {
    dueDateDiff = differenceInCalendarDays(new Date(estCompletedAt), new Date(dueDate));
  }

  return (
    <div className={TimelineStyle}>
      <div className={MilestoneNameStyle}>{name}</div>

      <div className={ProgressBarStyle}>
        <div className={BarStyle(calculatePercentage(total, completed))} />
        <div className={MilestoneTickStyle(isCompleted)}>
          <Icon icon="CONFIRM" />
        </div>
      </div>

      <div className={TasksWrapperStyle}>
        <div className={CompletedTasksStyle(completed)}>{completed}</div>
        <div className={TotalTasksStyle}>{`\u00A0/ ${total}`}</div>
        <div className={TaskIconStyle}>
          <Icon icon="TASK" />
        </div>
      </div>

      <Tooltip
        message={
          <MilestoneDueDateToolTip
            dueDate={dueDate}
            estDate={estCompletedAt}
            completedAt={completedAt}
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
                <FormattedDate value={dueDate} />
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

            <div className={MilestoneDateStyle(completedAt)}>
              {isCompleted ? (
                <FormattedDate value={completedAt} />
              ) : (
                <>
                  {estCompletedAt ? (
                    <FormattedDate value={estCompletedAt} />
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

export default MilestoneBlock;
