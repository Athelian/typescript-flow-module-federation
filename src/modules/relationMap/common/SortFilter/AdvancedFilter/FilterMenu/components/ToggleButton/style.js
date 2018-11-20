// @flow
import { css } from 'react-emotion';
import { presets, colors, fontSizes } from 'styles/common';

export const ToggleButtonStyle = (isActive: boolean): string => css`
  ${presets.BUTTON};
  ${fontSizes.HUGE};
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  ${isActive
    ? `
      color: ${colors.TEAL};
      &:hover, :focus {
        color: ${colors.TEAL_DARK};
      }
    `
    : `
      color: ${colors.GRAY_LIGHT};
      &:hover, :focus {
        color: ${colors.GRAY_DARK};
      }
    `};
`;

export default ToggleButtonStyle;
