// @flow
import { css } from 'react-emotion';
import { presets, borderRadiuses, colors, fontSizes, shadows } from 'styles/common';

type TimelineIcon = {
  icon: string,
  color: string,
};

const ICON_SIZE = 20;

export const TimelineIconStyle = ({ icon, color }: TimelineIcon) => css`
  ${presets.BUTTON};
  ${borderRadiuses.CIRCLE};
  background-color: ${colors.WHITE};
  ${icon === 'UNKNOWN' || icon === 'SHIPMENT' || icon === 'PLANE'
    ? `
      position: absolute;
      top: calc(50% - ${ICON_SIZE / 2}px);
    `
    : `border: 2px solid ${colors[color]}`};
  color: ${colors[color]};
  ${fontSizes.LITTLE};
  width: ${ICON_SIZE}px;
  height: ${ICON_SIZE}px;
  flex-shrink: 0;
  z-index: 1;
  &:hover,
  :focus {
    ${shadows.INPUT};
  }
`;

export default TimelineIconStyle;
