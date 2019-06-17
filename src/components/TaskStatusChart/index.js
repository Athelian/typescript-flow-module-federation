// @flow
import React from 'react';
import { ChartStyle, BarStyle, PropsStyle, NumberStyle } from './style';

type Props = {
  completed: number,
  inProgress: number,
  skipped: number,
  unCompleted: number,
};

const TaskStatusChart = ({ completed, inProgress, skipped, unCompleted }: Props) => {
  const sum = completed + inProgress + skipped + unCompleted;

  return (
    <div>
      {sum === 0 ? (
        <div className={ChartStyle}>
          <div className={BarStyle('GRAY_DARK', 1)}></div>
        </div>
      ) : (
        <div className={ChartStyle}>
          {completed / sum !== 0 && <div className={BarStyle('TEAL', completed / sum)}></div>}
          {inProgress / sum !== 0 && <div className={BarStyle('WHITE', inProgress / sum)}></div>}
          {skipped / sum !== 0 && <div className={BarStyle('GRAY_LIGHT', skipped / sum)}></div>}
          {unCompleted / sum !== 0 && (
            <div className={BarStyle('GRAY_DARK', unCompleted / sum)}></div>
          )}
        </div>
      )}

      <div className={PropsStyle}>
        <div className={NumberStyle('TEAL')}>{completed}</div>
        <div className={NumberStyle('WHITE')}>{inProgress}</div>
        <div className={NumberStyle('GRAY_LIGHT')}>{skipped}</div>
        <div className={NumberStyle('GRAY_DARK')}>{unCompleted}</div>
      </div>
    </div>
  );
};

export default TaskStatusChart;
