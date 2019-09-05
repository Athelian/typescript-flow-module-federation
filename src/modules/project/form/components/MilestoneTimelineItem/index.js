// @flow
import React from 'react';
import Icon from 'components/Icon';
import { calculatePercentage } from 'utils/ui';
import { isNullOrUndefined } from 'utils/fp';
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
} from './style';

type Props = {
  milestone: Object,
};

const MilestoneTimelineItem = ({ milestone }: Props) => {
  const { name, completedAt, tasks = [] } = milestone;

  const isCompleted = !isNullOrUndefined(completedAt);
  const total = tasks.length;
  const completed = tasks.filter(item => !isNullOrUndefined(item.completedAt)).length;

  return (
    <div className={TimelineItemStyle}>
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
    </div>
  );
};

export default MilestoneTimelineItem;
