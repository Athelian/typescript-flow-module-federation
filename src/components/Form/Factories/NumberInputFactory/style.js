// @flow
import { css } from 'react-emotion';
import { colors, fontSizes } from 'styles/common';

export const SuffixStyle: string = css`
  ${fontSizes.MAIN};
  color: ${colors.BLACK};
  font-weight: bold;
  padding: 0 5px 0 0;
`;

export const CalculatorIconStyle: string = css`
  position: absolute;
  top: 0;
  right: -40px;
  height: 30px;
  line-height: 30px;
  width: 30px;
  flex-shrink: 0;
  color: ${colors.GRAY_LIGHT};
  background-color: ${colors.WHITE};
  ${fontSizes.MAIN};
`;
