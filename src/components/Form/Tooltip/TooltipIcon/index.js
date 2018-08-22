// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { colors } from 'styles/common';
import { IconStyle, ChangedStyle } from './style';
import type { TooltipIconProps as Props } from './type.js.flow';

const iconMap = {
  info: 'INFO',
  changed: null,
  warning: 'WARNING',
  error: 'WARNING',
};

const colorMap = {
  info: colors.GRAY,
  changed: colors.TEAL,
  warning: colors.YELLOW,
  error: colors.RED,
};

const TooltipIcon = ({ type, hasInfo }: Props) => {
  const icon = iconMap[type] || (hasInfo && iconMap.info);
  const color = hasInfo && type === 'changed' ? colors.TEAL : colorMap[type];
  return (
    <div className={IconStyle(color)}>
      {icon ? <Icon icon={icon} /> : <svg className={ChangedStyle} />}
    </div>
  );
};

export default TooltipIcon;
