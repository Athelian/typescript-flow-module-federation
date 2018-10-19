// @flow
import { css } from 'react-emotion';
import { presets, colors, fontSizes, shadows } from 'styles/common';

export const IconStyle = (color: string, disabled: boolean): string => css`
  ${presets.BUTTON};
  width: 20px;
  height: 20px;
  ${fontSizes.SMALL};
  color: ${disabled ? 'rgba(0, 0, 0, 0.25)' : colors.WHITE};
  background: ${colors[color]};
  cursor: pointer;
  ${disabled && 'cursor: not-allowed'};
  z-index: 1;
  border-radius: 999px;
  &:hover,
  :focus {
    ${shadows.INPUT};
  }
`;

export default IconStyle;
