// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { IconStyle, SummaryBadgeWrapper, SummaryBadgeLabel } from './style';

type BadgeProps = {
  icon: string,
  color: string,
  label: string | React.Node,
  no: number,
};

const Badge = (props: BadgeProps) => {
  const { icon, color, label, no } = props;
  return (
    <div className={SummaryBadgeWrapper}>
      <div className={IconStyle(color)}>
        <Icon icon={icon} />
      </div>
      <span className={SummaryBadgeLabel}>
        {label} ({no})
      </span>
    </div>
  );
};

export default Badge;
