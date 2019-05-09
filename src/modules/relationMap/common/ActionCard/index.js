// @flow
import * as React from 'react';
import { StringValue } from 'react-values';
import Icon from 'components/Icon';
import { Tooltip } from 'components/Tooltip';
import { ActionCardWrapperStyle, DisabledWrapper, ActionWrapperStyle } from './style';

type ActionCardProps = {
  children: Function,
  show: boolean,
};

type OptionalActionProps = {
  className: string,
  onClick?: Function,
  toggle?: Function,
  targeted?: string,
  tooltipMessage?: React.Node,
};

type ActionProps = OptionalActionProps & {
  icon: string,
};

const DisabledAction = () => <div className={DisabledWrapper} />;

const Action = ({ icon, targeted, className, onClick, toggle, tooltipMessage }: ActionProps) => {
  const action = (
    <div
      className={ActionWrapperStyle(targeted === icon)}
      role="presentation"
      onClick={() => {
        const isSelectedAction = targeted === icon;
        if (toggle) {
          toggle(isSelectedAction ? null : icon);
        }
        if (onClick) {
          onClick(isSelectedAction);
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

Action.defaultProps = {
  className: '',
};

const ActionCard = ({ children, show }: ActionCardProps) => (
  <StringValue>
    {({ value: targeted, set: toggle }) =>
      show && (
        <div className={ActionCardWrapperStyle}>
          {children({
            targeted,
            toggle,
          })}
        </div>
      )
    }
  </StringValue>
);

export { Action, DisabledAction };

export default ActionCard;
