// @flow
import { css } from 'react-emotion';
import { presets, borderRadiuses, colors, fontSizes, shadows } from 'styles/common';

export const TimelineIconStyle = (color: string): string => css`
  ${presets.BUTTON};
  ${borderRadiuses.CIRCLE};
  background-color: ${colors.WHITE};
  color: ${colors[color]};
  ${fontSizes.MAIN};
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  z-index: 1;
  border: 2px solid ${colors[color]};
  &:hover,
  :focus {
    ${shadows.INPUT};
  }
`;

export const TransitIconWrapperStyle: string = css`
  position: relative;
  z-index: 1;
`;

export const TransitIconTopStyle: string = css`
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

export const TransitIconBottomStyle: string = css`
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
