// @flow
import React from 'react';
import FormattedNumber from 'components/FormattedNumber';
import { Tooltip } from 'components/Tooltip';
import Ring from 'components/Ring';
import type { TaskRingDataProps } from 'components/TaskRing/type.js.flow';
import TaskRingTooltipMessage from '../TaskRingTooltipMessage';
import { TaskRingStyle, NumberStyle, TooltipStyle } from './style';

type Props = TaskRingDataProps & {
  size: number,
};

const percent = ({ completedCount, inProgressCount, remainingCount }: TaskRingDataProps) => {
  const total = completedCount + inProgressCount + remainingCount;

  if (total > 0) {
    return (completedCount * 100) / total;
  }
  return 0;
};

const BasicTaskRing = ({ completedCount, inProgressCount, remainingCount, size }: Props) => (
  <Tooltip
    className={TooltipStyle}
    message={
      <TaskRingTooltipMessage
        completedCount={completedCount}
        inProgressCount={inProgressCount}
        remainingCount={remainingCount}
      />
    }
  >
    <div className={TaskRingStyle(size)}>
      <Ring
        percent={percent({ completedCount, inProgressCount, remainingCount })}
        size={size}
        color="TEAL"
      />
      <div className={NumberStyle(size - 4)}>
        <FormattedNumber value={completedCount + inProgressCount + remainingCount} />
      </div>
    </div>
  </Tooltip>
);

export default BasicTaskRing;
