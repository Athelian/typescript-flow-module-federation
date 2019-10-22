// @flow
import { css } from 'react-emotion';
import { colors, fontSizes } from 'styles/common';

export const WrapperStyle: string = css`
  display: grid;
  width: 100%;
  grid-template-columns: auto 30px 30px;
`;

export const CalculatorIconStyle: string = css`
  height: 25px;
  line-height: 25px;
  width: 25px;
  flex-shrink: 0;
  color: ${colors.GRAY_LIGHT};
  background-color: ${colors.WHITE};
  ${fontSizes.MAIN};
  text-align: center;
`;
