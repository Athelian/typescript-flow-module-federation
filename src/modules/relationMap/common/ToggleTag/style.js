// @flow
import { css } from 'react-emotion';
import { presets, colors, fontSizes } from 'styles/common';

export const StatusStyle = (isToggle: boolean) => css`
  display: inline-flex;
  color: ${isToggle ? colors.TEAL : colors.GRAY};
  ${fontSizes.MAIN};
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
