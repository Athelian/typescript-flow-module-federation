// @flow
import { css } from 'react-emotion';
import { presets, borderRadiuses, colors, fontSizes, shadows } from 'styles/common';

type TimelineIcon = {
  icon: string,
  color: string,
};

export const TimelineIconStyle = ({ icon, color }: TimelineIcon) => css`
  ${presets.BUTTON};
  ${borderRadiuses.CIRCLE};
  border: ${icon === 'UNKNOWN' || icon === 'SHIPMENT' || icon === 'PLANE'
    ? 'none'
    : `2px solid ${colors[color]}`};
  color: ${colors[color]};
  ${fontSizes.MAIN};
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  &:hover,
  :focus {
    ${shadows.INPUT};
  }
`;

export const TransitIconWrapperStyle = css`
  position: relative;
`;

export const TransitIconTopStyle = css`
  position: absolute;
  top: 0;
  left: 0;
  ${presets.BUTTON};
  border-radius: 30px 30px 0 0;
  width: 30px;
  height: 15px;
  flex-shrink: 0;
  &:hover,
  :focus {
    ${shadows.INPUT};
  }
`;

export const TransitIconBottomStyle = css`
  position: absolute;
  bottom: 0;
  left: 0;
  ${presets.BUTTON};
  border-radius: 0 0 30px 30px;
  width: 30px;
  height: 15px;
  flex-shrink: 0;
  border-top: 2px solid transparent;
  &:hover,
  :focus {
    ${shadows.INPUT};
    border-color: rgba(0, 0, 0, 0.1);
  }
`;
