// @flow
import * as React from 'react';
import Icon from 'components/Icon';
import { IconStyle } from './style';
import type { TooltipIconProps as Props } from './type.js.flow';

const iconMap = {
  info: 'INFO',
  changed: 'CIRCLE',
  warning: 'WARNING',
  error: 'WARNING',
};

const colorMap = {
  info: 'GRAY',
  changed: 'TEAL',
  warning: 'YELLOW',
  error: 'RED',
};

const TooltipIcon = React.forwardRef<Props, HTMLDivElement>(({ type, hasInfo }: Props, ref) => {
  const icon = iconMap[hasInfo ? 'info' : type];
  const color = colorMap[type];
  return (
    <div ref={ref} className={IconStyle(color)}>
      <Icon icon={icon} />
    </div>
  );
});

export default TooltipIcon;
