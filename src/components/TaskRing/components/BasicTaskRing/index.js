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

const percent = ({ completed, inProgress, remain, skipped }: TaskRingDataProps) => {
  const total = completed + inProgress + remain + skipped;

  if (total > 0) {
    return (completed * 100) / total;
  }
  return 0;
};

const BasicTaskRing = ({ taskCount, size }: Props) => {
  const { completed, inProgress, remain, skipped } = taskCount;

  return (
    <Tooltip className={TooltipStyle} message={<TaskRingTooltipMessage {...taskCount} />}>
      <div className={TaskRingStyle(size)}>
        <Ring percent={percent(taskCount)} size={size} color="TEAL" />
        <div className={NumberStyle(size - 4)}>
          <FormattedNumber value={completed + inProgress + remain + skipped} />
        </div>
      </div>
    </Tooltip>
  );
};

export default BasicTaskRing;
