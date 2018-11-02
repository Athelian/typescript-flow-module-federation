// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { IconStyle, SummaryBadgeWrapper, SummaryBadgeLabel } from './style';

type BadgeProps = {
  icon: string,
  color: string,
  hoverColor?: string,
  label: string | React.Node,
  no: number,
  onClick?: Function,
};

const Badge = (props: BadgeProps) => {
  const { icon, color, hoverColor, label, no, onClick } = props;
  return (
    <div className={SummaryBadgeWrapper} role="presentation">
      <button type="button" onClick={onClick}>
        <div className={IconStyle(color, hoverColor)}>
          <Icon icon={icon} />
        </div>
      </button>
      <span className={SummaryBadgeLabel}>
        {label} ({no})
      </span>
    </div>
  );
};

export default Badge;
