// @flow
import React from 'react';
import FormattedNumber from 'components/FormattedNumber';
import Tooltip from 'components/Tooltip';
import Ring from 'components/Ring';
import type { TaskRingDataProps } from 'components/TaskRing/type.js.flow';
import TaskRingTooltipMessage from '../TaskRingTooltipMessage';
import { TaskRingStyle, NumberStyle, TooltipStyle } from './style';

const percent = ({ completedCount, inProgressCount, remainingCount }: TaskRingDataProps) => {
  const total = completedCount + inProgressCount + remainingCount;

  if (total > 0) {
    return (completedCount * 100) / total;
  }
  return 0;
};

const BasicTaskRing = ({ completedCount, inProgressCount, remainingCount }: TaskRingDataProps) => (
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
    <div className={TaskRingStyle}>
      <Ring
        percent={percent({ completedCount, inProgressCount, remainingCount })}
        size={20}
        color="TEAL"
      />
      <div className={NumberStyle}>
        <FormattedNumber value={completedCount + inProgressCount + remainingCount} />
      </div>
    </div>
  </Tooltip>
);

export default BasicTaskRing;
