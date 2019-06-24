// @flow
import * as React from 'react';
import FormattedDate from 'components/FormattedDate';
import {
  WrapperStyle,
  MilestoneNameStyle,
  TimelinesStyle,
  TimelineStyle,
  ProgressBarStyle,
  BarStyle,
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
    <div className={WrapperStyle}>
      <div className={TimelinesStyle(milestones.length)}>
        {milestones.map((milestone, counter) => (
          <div className={TimelineStyle} key={JSON.stringify(milestone)}>
            <div className={MilestoneNameStyle(milestone.isCompleted)}>{milestone.name}</div>
            <div className={ProgressBarStyle(counter === 0, counter === milestones.length - 1)}>
              <div
                className={BarStyle({
                  percent: calculatePercentage(milestone.total, milestone.completed),
                  isFirst: counter === 0,
                  isLast: counter === milestones.length - 1,
                })}
              />
            </div>
            <div>
              {milestone.completed}/{milestone.total}
            </div>
            <div>
              <FormattedDate value={milestone.dueDate} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
