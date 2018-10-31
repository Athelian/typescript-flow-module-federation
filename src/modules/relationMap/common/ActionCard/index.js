// @flow
import React from 'react';
import { cx } from 'react-emotion';
import { StringValue } from 'react-values';
import Icon from 'components/Icon';
import * as style from './style';

type ActionCardProps = {
  children: Function,
  show: boolean,
};

type OptionalActionProps = {
  className: string,
  onClick: Function,
  toggle: Function,
};

type ActionProps = OptionalActionProps & {
  icon: string,
  targetted: boolean,
};

const Action = ({ icon, targetted, className, onClick, toggle }: ActionProps) => (
  <div
    className={cx(style.ActionWrapperStyle(targetted === icon), className)}
    role="presentation"
    onClick={() => {
      if (toggle) {
        if (targetted === icon) {
          toggle(null);
        } else {
          toggle(icon);
        }
      }
      if (onClick) {
        onClick();
      }
    }}
  >
    <Icon icon={icon} />
  </div>
);
Action.defaultProps = {
  className: '',
};

const ActionCard = ({ children, show }: ActionCardProps) => (
  <StringValue>
    {({ value: targetted, set: toggle }) =>
      show && (
        <div className={cx(style.OverlayStyle, style.CardWrapperStyle)}>
          {children({
            targetted,
            toggle,
          })}
        </div>
      )
    }
  </StringValue>
);

export { Action };
export default ActionCard;
