// @flow
import React from 'react';
import Icon from 'components/Icon';
import { TaskStatusChartStyle, ChartStyle, BarStyle, PropsStyle, NumberStyle } from './style';

type OptionalProps = {
  completed: number,
  inProgress: number,
  skipped: number,
  unCompleted: number,
};

type Props = OptionalProps & {};

const defaultProps = {
  completed: 0,
  inProgress: 0,
  skipped: 0,
  unCompleted: 0,
};

const TaskStatusChart = ({ completed, inProgress, skipped, unCompleted }: Props) => {
  const sum = completed + inProgress + skipped + unCompleted;

  return (
    <div className={TaskStatusChartStyle}>
      {sum === 0 ? (
        <div className={ChartStyle}>
          <div className={BarStyle('GRAY_VERY_LIGHT', 1)} />
        </div>
      ) : (
        <div className={ChartStyle}>
          {completed / sum !== 0 && <div className={BarStyle('TEAL', completed / sum)} />}
          {inProgress / sum !== 0 && <div className={BarStyle('WHITE', inProgress / sum)} />}
          {skipped / sum !== 0 && <div className={BarStyle('GRAY_LIGHT', skipped / sum)} />}
          {unCompleted / sum !== 0 && (
            <div className={BarStyle('GRAY_VERY_LIGHT', unCompleted / sum)} />
          )}
        </div>
      )}

      <div className={PropsStyle}>
        <div className={NumberStyle({ color: 'WHITE', backgroundColor: 'TEAL' })}>
          <Icon icon="CHECKED" />
          {completed}
        </div>
        <div className={NumberStyle({ color: 'TEAL', backgroundColor: 'WHITE' })}>
          <Icon icon="STOPWATCH" />
          {inProgress}
        </div>
        <div className={NumberStyle({ color: 'BLACK', backgroundColor: 'GRAY_LIGHT' })}>
          <Icon icon="SKIPPED" />
          {skipped}
        </div>
        <div className={NumberStyle({ color: 'GRAY_DARK', backgroundColor: 'GRAY_VERY_LIGHT' })}>
          {unCompleted}
        </div>
      </div>
    </div>
  );
};

TaskStatusChart.defaultProps = defaultProps;

export default TaskStatusChart;
