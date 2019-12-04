// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { Tooltip } from 'components/Tooltip';
import { ActionCardWrapperStyle, ActionWrapperStyle } from './style';

type ActionCardProps = {|
  children: React$Node,
  show: boolean,
|};

type ActionProps = {|
  className?: string,
  onClick?: Function,
  targeted: boolean,
  tooltipMessage?: React.Node,
  icon: string,
|};

const Action = ({ icon, targeted, className, onClick, tooltipMessage }: ActionProps) => {
  const action = (
    <div
      className={ActionWrapperStyle(targeted)}
      role="presentation"
      onClick={() => {
        if (onClick) {
          onClick(!targeted);
        }
      }}
    >
      <div className={className}>
        <Icon icon={targeted ? icon : `${icon}_REGULAR`} />
      </div>
    </div>
  );

  if (tooltipMessage) {
    return (
      <Tooltip message={tooltipMessage} delay={800}>
        {action}
      </Tooltip>
    );
  }

  return action;
};

const ActionCard = ({ children, show }: ActionCardProps) => {
  return show && <div className={ActionCardWrapperStyle}>{children}</div>;
};

export { Action };

export default ActionCard;
