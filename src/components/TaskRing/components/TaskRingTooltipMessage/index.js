// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from 'components/Icon';
import type { TaskRingDataProps } from 'components/TaskRing/type.js.flow';
import { TaskInfoStyle } from './style';

const TooltipMessage = ({ completedCount, inProgressCount, remainingCount }: TaskRingDataProps) => (
  <div>
    <div className={TaskInfoStyle}>
      <Icon icon="CONFIRM" />
      <FormattedMessage id="components.taskRing.completed" defaultMessage="Completed" />
      <div>{completedCount}</div>
    </div>
    <div className={TaskInfoStyle}>
      <Icon icon="CLOCK" />
      <FormattedMessage id="components.taskRing.inProgress" defaultMessage="In Progress" />
      <div>{inProgressCount}</div>
    </div>
    <div className={TaskInfoStyle}>
      <Icon icon="TASK" />
      <FormattedMessage id="components.taskRing.remain" defaultMessage="Remain" />
      <div>{remainingCount}</div>
    </div>
  </div>
);

export default TooltipMessage;
