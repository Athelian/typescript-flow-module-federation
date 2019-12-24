/* eslint-disable no-nested-ternary */
// @flow
import { css } from 'react-emotion';
import { colors, fontSizes, presets } from 'styles/common';

export const DelayStyle = (value: number): string => css`
  color: ${value !== 0 ? (value > 0 ? colors.RED : colors.TEAL) : colors.BLACK};
  ${fontSizes.SMALL};
  ${presets.ELLIPSIS};
  font-weight: bold;
  text-align: center;
`;

export default DelayStyle;
