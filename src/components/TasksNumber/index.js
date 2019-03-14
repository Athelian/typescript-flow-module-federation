// @flow
import React from 'react';
import { FormattedMessage } from 'react-intl';
import FormattedNumber from 'components/FormattedNumber';
import Ring from 'components/Ring';
import Tooltip from 'components/Tooltip';
import Icon from 'components/Icon';
import { TasksNumberStyle, NumberStyle, TooltipStyle, TaskInfoStyle } from './style';

type OptionalProps = {
  completedCount: number,
  inProgressCount: number,
  remainingCount: number,
};

type Props = OptionalProps & {};

const defaultProps = {
  completedCount: 0,
  inProgressCount: 0,
  remainingCount: 0,
};

const percent = ({ completedCount, inProgressCount, remainingCount }: Props) =>
  (completedCount * 100) / (completedCount + inProgressCount + remainingCount);

percent.defaultProps = defaultProps;

const TooltipMessage = ({ completedCount, inProgressCount, remainingCount }: Props) => (
  <div>
    <div className={TaskInfoStyle}>
      <Icon icon="CONFIRM" />
      <FormattedMessage id="components.tasksNumber.completed" defaultMessage="Completed" />
      <div>{completedCount}</div>
    </div>
    <div className={TaskInfoStyle}>
      <Icon icon="CLOCK" />
      <FormattedMessage id="components.tasksNumber.inProgress" defaultMessage="In Progress" />
      <div>{inProgressCount}</div>
    </div>
    <div className={TaskInfoStyle}>
      <Icon icon="TASK" />
      <FormattedMessage id="components.tasksNumber.remain" defaultMessage="Remain" />
      <div>{remainingCount}</div>
    </div>
  </div>
);

const TasksNumber = ({ completedCount, inProgressCount, remainingCount }: Props) => (
  <Tooltip
    className={TooltipStyle}
    message={
      <TooltipMessage
        completedCount={completedCount}
        inProgressCount={inProgressCount}
        remainingCount={remainingCount}
      />
    }
  >
    <div className={TasksNumberStyle}>
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

TasksNumber.defaultProps = defaultProps;

export default TasksNumber;
