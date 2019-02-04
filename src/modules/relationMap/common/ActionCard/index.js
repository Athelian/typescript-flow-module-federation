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
  onClick?: Function,
  toggle?: Function,
  targeted?: string,
};

type ActionProps = OptionalActionProps & {
  icon: string,
};

const DisabledAction = () => <div className={style.DisabledWrapper} />;

const Action = ({ icon, targeted, className, onClick, toggle }: ActionProps) => (
  <div
    className={style.ActionWrapperStyle(targeted === icon)}
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
Action.defaultProps = {
  className: '',
};

const ActionCard = ({ children, show }: ActionCardProps) => (
  <StringValue>
    {({ value: targeted, set: toggle }) =>
      show && (
        <div className={cx(style.OverlayStyle, style.CardWrapperStyle)}>
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
