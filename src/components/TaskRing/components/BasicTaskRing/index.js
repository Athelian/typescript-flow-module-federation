// @flow
import React from 'react';
import FormattedNumber from 'components/FormattedNumber';
import { Tooltip } from 'components/Tooltip';
import Ring from 'components/Ring';
import type { TaskRingDataProps } from 'components/TaskRing/type.js.flow';
import TaskRingTooltipMessage from '../TaskRingTooltipMessage';
import { TaskRingStyle, NumberStyle, TooltipStyle } from './style';

type Props = {
  taskCount: TaskRingDataProps,
  size: number,
};

const percent = (current: number, total: number): number =>
  total > 0 ? (current * 100) / total : 0;

const BasicTaskRing = ({ taskCount, size }: Props) => {
  const { completed, inProgress, remain, skipped } = taskCount;
  const total = completed + inProgress + remain + skipped;

  return (
    <Tooltip className={TooltipStyle} message={<TaskRingTooltipMessage {...taskCount} />}>
      <div className={TaskRingStyle(size)}>
        <Ring percent={percent(completed + skipped, total)} size={size} color="TEAL" />
        <div className={NumberStyle(size - 4)}>
          <FormattedNumber value={total} />
        </div>
      </div>
    </Tooltip>
  );
};

export default BasicTaskRing;
