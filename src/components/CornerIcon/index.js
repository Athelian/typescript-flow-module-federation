// @flow
import * as React from 'react';
import { cx } from 'react-emotion';
import Icon from 'components/Icon';
import { WrapperStyle, CornerIconStyle } from './style';

type Props = {
  icon: string,
  color: string,
  className?: string,
};

const CornerIcon = ({ icon, color, className }: Props) => (
  <div className={cx(WrapperStyle, className)}>
    <div className={CornerIconStyle(color)}>
      <Icon icon={icon} />
    </div>
  </div>
);

export default CornerIcon;
