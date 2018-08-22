// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { colors } from 'styles/common';
import { IconStyle } from './style';
import type { TooltipIconProps as Props } from './type.js.flow';

const iconMap = {
  info: 'INFO',
  changed: '',
  warning: 'WARNING',
  error: 'WARNING',
};

const colorMap = {
  info: colors.GRAY,
  changed: colors.GRAY,
  warning: colors.YELLOW,
  error: colors.RED,
};

const TooltipIcon = ({ type, hasInfo }: Props) => {
  const icon = hasInfo ? iconMap.info : iconMap[type];
  const color = colorMap[type];
  return (
    <div className={IconStyle(color)}>
      <Icon icon={icon} />
    </div>
  );
};

export default TooltipIcon;
