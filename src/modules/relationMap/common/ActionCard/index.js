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
  onUnClick?: Function,
  toggle: Function,
};

type ActionProps = OptionalActionProps & {
  icon: string,
  targetted: boolean,
};

const Action = ({ icon, targetted, className, onClick, onUnClick, toggle }: ActionProps) => (
  <div
    className={style.ActionWrapperStyle(targetted === icon)}
    role="presentation"
    onClick={() => {
      if (targetted === icon) {
        if (toggle) {
          toggle(null);
        }
        if (onUnClick) {
          onUnClick();
        }
      } else {
        if (toggle) {
          toggle(icon);
        }
        if (onClick) {
          onClick();
        }
      }
    }}
  >
    <div className={className}>
      <Icon icon={targetted ? `${icon}_REGULAR` : icon} />
    </div>
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
