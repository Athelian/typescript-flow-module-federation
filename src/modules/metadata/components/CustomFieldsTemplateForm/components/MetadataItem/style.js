// @flow
import { css } from 'react-emotion';
import { presets, layout, colors } from 'styles/common';

export const AdjustmentWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
`;

export const CheckBoxStyle = (checked: boolean): string => css`
  position: absolute;
  width: 30px;
  height: 30px;
  left: -30px;
  ${presets.BUTTON};
  color: ${checked ? colors.TEAL : colors.GRAY_LIGHT};
`;

export const AdjustmentFieldsWrapperStyle: string = css`
  width: 400px;
  height: 30px;
  position: relative;
  ${layout.GRID_HORIZONTAL};
  grid-gap: 10px;
  align-content: center;
`;
