// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { WrapperStyle, CornerIconStyle } from './style';

type Props = {
  icon: string,
  color: string,
};

const CornerIcon = ({ icon, color }: Props) => (
  <div className={WrapperStyle}>
    <div className={CornerIconStyle(color)}>
      <Icon icon={icon} />
    </div>
  </div>
);

export default CornerIcon;
