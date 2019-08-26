// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import FormattedDate from 'components/FormattedDate';
import Icon from 'components/Icon';
import { Tooltip } from 'components/Tooltip';
import { calculatePercentage, diffDueDate } from 'utils/ui';
import { isNullOrUndefined } from 'utils/fp';
import MilestoneDueDateToolTip from '../MilestoneDueDateToolTip';

import {
  TimelineStyle,
  MilestoneNameStyle,
  ProgressBarStyle,
  TasksWrapperStyle,
  MilestoneDateStyle,
  BarStyle,
  MilestoneTickStyle,
  CompletedTasksStyle,
  TotalTasksStyle,
  TaskIconStyle,
  MilestoneDiffDateStyle,
} from './style';

type Props = {
  milestone: Object,
};

const MilestoneBlock = ({ milestone }: Props) => {
  const { name, dueDate, estDate, completedAt, tasks = [] } = milestone;

  const isCompleted = !isNullOrUndefined(completedAt);
  const total = tasks.length;
  const completed = tasks.filter(item => isNullOrUndefined(item.completedAt)).length;

  const { value: dueDateDiff, color } = isCompleted
    ? diffDueDate({ dueDate, date: completedAt })
    : diffDueDate({ dueDate, date: estDate });

  return (
    <div className={TimelineStyle}>
      <div className={MilestoneNameStyle(isCompleted)}>{name}</div>
      <div className={ProgressBarStyle}>
        <div className={BarStyle(calculatePercentage(total, completed))} />
        <div className={MilestoneTickStyle(isCompleted)}>
          <Icon icon="CONFIRM" />
        </div>
      </div>
      <div className={TasksWrapperStyle(isCompleted)}>
        <div className={CompletedTasksStyle(isCompleted, completed)}>{completed}</div>
        <div className={TotalTasksStyle(isCompleted)}>{`/ ${total}`}</div>
        <div className={TaskIconStyle(isCompleted)}>
          <Icon icon="TASK" />
        </div>
      </div>
      <Tooltip
        message={
          <MilestoneDueDateToolTip dueDate={dueDate} estDate={estDate} completedAt={completedAt} />
        }
      >
        <div>
          <div className={MilestoneDateStyle}>
            <FormattedMessage id="components.card.due" defaultMessage="DUE" />
            <div>{dueDate ? <FormattedDate value={dueDate} /> : 'N/A'}</div>
          </div>

          <div className={MilestoneDateStyle}>
            {isCompleted ? (
              <>
                <FormattedMessage id="components.card.compl" defaultMessage="COMPL." />
                <div>
                  {completedAt ? <FormattedDate value={completedAt} /> : 'N/A'}
                  {dueDateDiff !== 0 && (
                    <span className={MilestoneDiffDateStyle(color)}>{dueDateDiff}</span>
                  )}
                </div>
              </>
            ) : (
              <>
                <FormattedMessage id="components.card.est." defaultMessage="EST." />
                <div>
                  {estDate ? <FormattedDate value={estDate} /> : 'N/A'}
                  {dueDateDiff !== 0 && (
                    <span className={MilestoneDiffDateStyle(color)}>{dueDateDiff}</span>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </Tooltip>
    </div>
  );
};

export default MilestoneBlock;
