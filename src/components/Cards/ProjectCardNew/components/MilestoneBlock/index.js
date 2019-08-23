// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import FormattedDate from 'components/FormattedDate';
import { differenceInCalendarDays } from 'date-fns';
import Icon from 'components/Icon';
import { Tooltip } from 'components/Tooltip';
import { calculatePercentage } from 'utils/ui';
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
  const { name, total, completed, isCompleted, dueDate, estDate, completedAt } = milestone;

  let diffDueDate;
  if (isCompleted) {
    if (dueDate && completedAt) {
      const diffDate = differenceInCalendarDays(new Date(completedAt), new Date(dueDate));
      if (diffDate === 0) {
        diffDueDate = '';
      } else if (diffDate > 0) {
        diffDueDate = <span className={MilestoneDiffDateStyle('RED')}>{`+${diffDate}`}</span>;
      } else {
        diffDueDate = <span className={MilestoneDiffDateStyle('TEAL')}>{diffDate}</span>;
      }
    } else {
      diffDueDate = <span className={MilestoneDiffDateStyle('GRAY')}>N/A</span>;
    }
  } else if (dueDate && estDate) {
    const diffDate = differenceInCalendarDays(new Date(estDate), new Date(dueDate));
    if (diffDate === 0) {
      diffDueDate = '';
    } else if (diffDate > 0) {
      diffDueDate = <span className={MilestoneDiffDateStyle('RED')}>{`+${diffDate}`}</span>;
    } else {
      diffDueDate = <span className={MilestoneDiffDateStyle('TEAL')}>{diffDate}</span>;
    }
  } else {
    diffDueDate = <span className={MilestoneDiffDateStyle('GRAY')}>N/A</span>;
  }

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
                  {diffDueDate}
                </div>
              </>
            ) : (
              <>
                <FormattedMessage id="components.card.est." defaultMessage="EST." />
                <div>
                  {estDate ? <FormattedDate value={estDate} /> : 'N/A'}
                  {diffDueDate}
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
