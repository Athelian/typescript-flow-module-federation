// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import FormattedNumber from 'components/FormattedNumber';
import Icon from 'components/Icon';
import type { TaskRingDataProps } from 'components/TaskRing/type.js.flow';
import {
  TaskRingTooltipWrapperStyle,
  TaskRingTooltipHeaderStyle,
  TaskRingTooltipInfoStyle,
  TaskRingTooltipIconStyle,
  TaskRingTooltipLabelStyle,
  TaskRingTooltipCountStyle,
} from './style';

const TaskRingTooltipMessage = ({
  completedCount,
  inProgressCount,
  remainingCount,
}: TaskRingDataProps) => (
  <div className={TaskRingTooltipWrapperStyle}>
    <div className={TaskRingTooltipHeaderStyle}>
      <FormattedMessage id="components.taskRing.tasks" defaultMessage="TASKS" />
    </div>

    <div className={TaskRingTooltipInfoStyle}>
      <div className={TaskRingTooltipIconStyle}>
        <Icon icon="CONFIRM" />
      </div>
      <div className={TaskRingTooltipLabelStyle}>
        <FormattedMessage id="components.taskRing.completed" defaultMessage="COMPLETED" />
      </div>
      <div className={TaskRingTooltipCountStyle('WHITE', 'TEAL')}>
        <FormattedNumber value={completedCount} />
      </div>
    </div>

    <div className={TaskRingTooltipInfoStyle}>
      <div className={TaskRingTooltipIconStyle}>
        <Icon icon="CLOCK" />
      </div>
      <div className={TaskRingTooltipLabelStyle}>
        <FormattedMessage id="components.taskRing.inProgress" defaultMessage="IN PROGRESS" />
      </div>
      <div className={TaskRingTooltipCountStyle('WHITE', 'BLACK')}>
        <FormattedNumber value={inProgressCount} />
      </div>
    </div>

    <div className={TaskRingTooltipInfoStyle}>
      <div className={TaskRingTooltipIconStyle}>
        <Icon icon="TASK" />
      </div>
      <div className={TaskRingTooltipLabelStyle}>
        <FormattedMessage id="components.taskRing.remain" defaultMessage="REMAINING" />
      </div>
      <div className={TaskRingTooltipCountStyle('WHITE', 'BLACK')}>
        <FormattedNumber value={remainingCount} />
      </div>
    </div>
  </div>
);

export default TaskRingTooltipMessage;
