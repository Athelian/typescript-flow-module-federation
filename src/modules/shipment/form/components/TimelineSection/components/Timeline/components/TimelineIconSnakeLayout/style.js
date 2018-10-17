// @flow
import { css } from 'react-emotion';
import { presets, borderRadiuses, colors, fontSizes, shadows } from 'styles/common';

type TimelineIcon = {
  icon: string,
  color: string,
  size: string,
};

export const TimelineIconStyle = ({ icon, color, size = 'MAIN' }: TimelineIcon): string => css`
  ${fontSizes[size]};
  ${presets.BUTTON};
  ${borderRadiuses.CIRCLE};
  background-color: ${colors.WHITE};
  ${icon === 'UNKNOWN' || icon === 'SHIPMENT' || icon === 'PLANE'
    ? `
      position: absolute;
      top: calc(50% - 1em);
      left: calc(50% - 1em);
    `
    : `border: 2px solid ${colors[color]}`};
  color: ${colors[color]};
  width: 2em;
  height: 2em;

  flex-shrink: 0;
  z-index: 1;
  &:hover,
  :focus {
    ${shadows.INPUT};
  }
`;

export default TimelineIconStyle;
