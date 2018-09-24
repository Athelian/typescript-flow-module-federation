// @flow
import { css } from 'react-emotion';
import { presets, borderRadiuses, colors, fontSizes, shadows } from 'styles/common';

type TimelineIcon = {
  icon: string,
  color: string,
};

export const TimelineIconStyle = ({ icon, color }: TimelineIcon): string => css`
  ${presets.BUTTON};
  ${borderRadiuses.CIRCLE};
  background-color: ${colors.WHITE};
  ${icon === 'UNKNOWN' || icon === 'SHIPMENT' || icon === 'PLANE'
    ? `
      position: absolute;
      top: calc(50% - 15px);
    `
    : `border: 2px solid ${colors[color]}`};
  color: ${colors[color]};
  ${fontSizes.MAIN};
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  z-index: 1;
  &:hover,
  :focus {
    ${shadows.INPUT};
  }
`;

export default TimelineIconStyle;
