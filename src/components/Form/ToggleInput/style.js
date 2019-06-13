// @flow
import { css } from 'react-emotion';
import { presets, colors, fontSizes } from 'styles/common';

export const ToggleInputStyle: string = css`
  ${presets.ELLIPSIS};
  display: flex;
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
