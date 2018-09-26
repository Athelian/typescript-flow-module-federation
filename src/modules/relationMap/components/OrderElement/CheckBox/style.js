// @flow
import { css } from 'react-emotion';
import { presets, colors, layout, fontSizes } from 'styles/common';

export const CheckBoxStyle = (archived: boolean) => css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 5px;
  color: ${archived ? colors.GRAY : colors.TEAL};
  ${fontSizes.MAIN};
  font-weight: bold;
  grid-template-columns: 20px 1fr;
  margin-bottom: -5px;
  margin-top: 30px;
`;

export const ToggleButtonStyle = (archived: boolean) => css`
  ${presets.BUTTON};
  justify-content: flex-start;
  font-size: 14px;
  color: ${archived ? colors.GRAY : colors.TEAL};
  &:hover,
  :focus {
    color: ${archived ? colors.GRAY_DARK : colors.TEAL_DARK};
  }
`;
