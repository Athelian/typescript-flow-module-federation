// @flow
import { css } from 'react-emotion';
import { presets, borderRadiuses, colors, fontSizes, shadows } from 'styles/common';

export const TimelineIconStyle = (color: string) => css`
  ${presets.BUTTON};
  ${borderRadiuses.CIRCLE};
  border: 2px solid ${colors[color]};
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

export default TimelineIconStyle;
