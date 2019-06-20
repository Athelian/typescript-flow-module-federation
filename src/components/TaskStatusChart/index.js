// @flow
import React from 'react';
import Icon from 'components/Icon';
import { TaskStatusChartStyle, ChartStyle, BarStyle, PropsStyle, NumberStyle } from './style';

type Props = {
  completed: number,
  inProgress: number,
  skipped: number,
  unCompleted: number,
};

const TaskStatusChart = ({ completed, inProgress, skipped, unCompleted }: Props) => {
  const sum = completed + inProgress + skipped + unCompleted;

  return (
    <div className={TaskStatusChartStyle}>
      {sum === 0 ? (
        <div className={ChartStyle}>
          <div className={BarStyle('GRAY_DARK', 1)} />
        </div>
      ) : (
        <div className={ChartStyle}>
          {completed / sum !== 0 && <div className={BarStyle('TEAL', completed / sum)} />}
          {inProgress / sum !== 0 && <div className={BarStyle('WHITE', inProgress / sum)} />}
          {skipped / sum !== 0 && <div className={BarStyle('GRAY_LIGHT', skipped / sum)} />}
          {unCompleted / sum !== 0 && <div className={BarStyle('GRAY_DARK', unCompleted / sum)} />}
        </div>
      )}

      <div className={PropsStyle}>
        <div className={NumberStyle('TEAL')}>
          <Icon icon="CHECKED" />
          {completed}
        </div>
        <div className={NumberStyle('WHITE')}>
          <Icon icon="STOPWATCH" />
          {inProgress}
        </div>
        <div className={NumberStyle('GRAY_LIGHT')}>
          <Icon icon="SKIPPED" />
          {skipped}
        </div>
        <div className={NumberStyle('GRAY_DARK')}>{unCompleted}</div>
      </div>
    </div>
  );
};

export default TaskStatusChart;
