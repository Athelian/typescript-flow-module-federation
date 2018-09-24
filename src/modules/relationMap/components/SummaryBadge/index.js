// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { IconStyle, SummaryBadgeWrapper } from './style';

type Props = {
  icon: string,
  color: string,
  label: string,
  no: number,
};

const SummaryBadge = (props: Props) => {
  const { icon, color, label, no } = props;

  return (
    <div className={SummaryBadgeWrapper}>
      <div className={IconStyle(color)}>
        <Icon icon={icon} />
      </div>
      <span>
        {label} ({no})
      </span>
    </div>
  );
};

export default SummaryBadge;
