// @flow
import { css } from 'react-emotion';
import { colors, fontSizes, layout } from 'styles/common';

export const OverridableMetricValueInputWrapperStyle: string = css`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 30px 35px;
  justify-items: center;
`;

export const CalculatorIconStyle: string = css`
  ${layout.HORIZONTAL};
  ${layout.CENTER_CENTER};
  ${fontSizes.MAIN};
  color: ${colors.GRAY_LIGHT};
  width: 30px;
  height: 30px;
  flex-shrink: 0;
`;

export const SelectStyle = css`
  width: 30px;
`;
