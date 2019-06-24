// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import FormattedDate from 'components/FormattedDate';
import {
  TimelineWrapperStyle,
  TimelineStyle,
  MilestoneNameStyle,
  ProgressBarStyle,
  BarStyle,
  MilestoneTickStyle,
  TasksWrapperStyle,
  CompletedTasksStyle,
  TotalTasksStyle,
  DueDateStyle,
} from './style';

type Props = {
  milestones: Array<{
    total: number,
    completed: number,
    dueDate: ?Date,
    isCompleted: boolean,
    name: string,
  }>,
};

const calculatePercentage = (total: number, completed: number) => {
  if (total) {
    if (completed >= total) return 100;
    return Math.round((completed * 100) / total);
  }

  return 0;
};

export default function MilestonesTimeline({ milestones }: Props) {
  return (
    <div className={TimelineWrapperStyle}>
      {milestones.map(milestone => (
        <div className={TimelineStyle} key={JSON.stringify(milestone)}>
          <div className={MilestoneNameStyle}>{milestone.name}</div>
          <div className={ProgressBarStyle}>
            <div className={BarStyle(calculatePercentage(milestone.total, milestone.completed))} />
            <div className={MilestoneTickStyle(milestone.isCompleted)}>
              <Icon icon="CONFIRM" />
            </div>
          </div>

          <div className={TasksWrapperStyle}>
            <div className={CompletedTasksStyle}>{milestone.completed}</div>
            <div className={TotalTasksStyle}>{`/ ${milestone.total}`}</div>
          </div>

          <div className={DueDateStyle}>
            <FormattedDate value={milestone.dueDate} />
          </div>
        </div>
      ))}
    </div>
  );
}
