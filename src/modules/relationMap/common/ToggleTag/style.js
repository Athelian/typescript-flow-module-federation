// @flow
import { css } from 'react-emotion';
import { presets, colors, layout, fontSizes } from 'styles/common';

export const StatusStyle = (isToggle: boolean) => css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 5px;
  color: ${isToggle ? colors.TEAL : colors.GRAY};
  ${fontSizes.MAIN};
  font-weight: 500;
  align-items: center;
`;

export const ToggleButtonStyle = (isToggle: boolean) => css`
  ${presets.BUTTON};
  font-size: 20px;
  color: ${isToggle ? colors.TEAL : colors.GRAY};
  &:hover,
  :focus {
    color: ${isToggle ? colors.TEAL_DARK : colors.GRAY_DARK};
  }
`;
