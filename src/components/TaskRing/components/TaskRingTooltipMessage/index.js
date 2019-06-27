// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import FormattedNumber from 'components/FormattedNumber';
import Icon from 'components/Icon';
import type { TaskRingDataProps } from 'components/TaskRing/type.js.flow';
import {
  TaskRingTooltipWrapperStyle,
  TaskRingTooltipHeaderStyle,
  TaskRingBodyStyle,
  TaskRingTooltipInfoStyle,
  TaskRingTooltipIconStyle,
  TaskRingTooltipLabelStyle,
  TaskRingTooltipCountStyle,
} from './style';

const TaskRingTooltipMessage = ({ completed, inProgress, remain, skipped }: TaskRingDataProps) => (
  <div className={TaskRingTooltipWrapperStyle}>
    <div className={TaskRingTooltipHeaderStyle}>
      <FormattedMessage id="components.taskRing.tasks" defaultMessage="TASKS" />
    </div>

    <div className={TaskRingBodyStyle}>
      <div className={TaskRingTooltipInfoStyle}>
        <div className={TaskRingTooltipIconStyle('TEAL')}>
          <Icon icon="CHECKED" />
        </div>
        <div className={TaskRingTooltipLabelStyle}>
          <FormattedMessage id="components.taskRing.completed" defaultMessage="COMPLETED" />
        </div>
        <div className={TaskRingTooltipCountStyle}>
          <FormattedNumber value={completed} />
        </div>
      </div>

      <div className={TaskRingTooltipInfoStyle}>
        <div className={TaskRingTooltipIconStyle('TEAL')}>
          <Icon icon="CLOCK" />
        </div>
        <div className={TaskRingTooltipLabelStyle}>
          <FormattedMessage id="components.taskRing.inProgress" defaultMessage="IN PROGRESS" />
        </div>
        <div className={TaskRingTooltipCountStyle}>
          <FormattedNumber value={inProgress} />
        </div>
      </div>

      <div className={TaskRingTooltipInfoStyle}>
        <div className={TaskRingTooltipIconStyle('GRAY_SUPER_LIGHT')}>
          <Icon icon="CHECKED" />
        </div>
        <div className={TaskRingTooltipLabelStyle}>
          <FormattedMessage id="components.taskRing.uncompleted" defaultMessage="UNCOMPLETED" />
        </div>
        <div className={TaskRingTooltipCountStyle}>
          <FormattedNumber value={remain} />
        </div>
      </div>

      <div className={TaskRingTooltipInfoStyle}>
        <div className={TaskRingTooltipIconStyle('GRAY_DARK')}>
          <Icon icon="SKIPPED" />
        </div>
        <div className={TaskRingTooltipLabelStyle}>
          <FormattedMessage id="components.taskRing.skipped" defaultMessage="SKIPPED" />
        </div>
        <div className={TaskRingTooltipCountStyle}>
          <FormattedNumber value={skipped} />
        </div>
      </div>
    </div>
  </div>
);

export default TaskRingTooltipMessage;
