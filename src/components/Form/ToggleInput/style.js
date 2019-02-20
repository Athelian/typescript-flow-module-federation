// @flow
import { css } from 'react-emotion';
import { presets, colors, fontSizes } from 'styles/common';

export const ToggleInputStyle = (toggled: boolean): string => css`
  ${presets.ELLIPSIS};
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr min-content;
  grid-gap: 5px;
  color: ${colors.GRAY_DARK_1};
  ${fontSizes.MAIN};
  align-items: center;

  button {
    color: ${toggled ? colors.TEAL : colors.GRAY};
  }
`;

export const ToggleButtonStyle = (toggled: boolean): string => css`
  ${presets.BUTTON};
  font-size: 20px;
  color: ${toggled ? colors.TEAL : colors.GRAY};
  &:hover,
  :focus {
    color: ${toggled ? colors.TEAL_DARK : colors.GRAY_DARK};
  }
  background-color: transparent;
`;
