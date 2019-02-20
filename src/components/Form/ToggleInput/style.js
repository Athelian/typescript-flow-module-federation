// @flow
import { css } from 'react-emotion';
import { presets, colors, fontSizes } from 'styles/common';

export const ToggleInputStyle: string = css`
  ${presets.ELLIPSIS};
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr min-content;
  grid-gap: 5px;
  color: ${colors.GRAY_DARK_1};
  ${fontSizes.MAIN};
  align-items: center;
`;

export const ToggleButtonStyle = (toggled: boolean, editable: boolean): string => css`
  ${presets.BUTTON};
  font-size: 20px;
  color: ${toggled ? colors.TEAL : colors.GRAY};
  background-color: transparent;
  ${editable
    ? `
    &:hover,
    :focus {
    color: ${toggled ? colors.TEAL_DARK : colors.GRAY_DARK};
  }
  `
    : `
    cursor: default;
  `};
`;
