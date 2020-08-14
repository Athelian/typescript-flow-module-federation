// @flow
import { css } from 'react-emotion';
import { presets, colors, layout, fontSizes } from 'styles/common';

export const StatusStyle = (archived: boolean): string => css`
  ${presets.ELLIPSIS};
  ${layout.GRID_HORIZONTAL};
  grid-gap: 5px;
  color: ${archived ? colors.GRAY : colors.TEAL};
  ${fontSizes.MAIN};
  font-weight: bold;
  align-items: center;
`;

export const ToggleButtonStyle = (archived: boolean): string => css`
  ${presets.BUTTON};
  font-size: 20px;
  color: ${archived ? colors.GRAY : colors.TEAL};
  &:hover,
  :focus {
    color: ${archived ? colors.GRAY_DARK : colors.TEAL_DARK};
  }
`;