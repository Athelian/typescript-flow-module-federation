// @flow
import { css } from 'react-emotion';
import { colors, fontSizes, presets } from 'styles/common';

export const DelayStyle = (isDelay: boolean): string => css`
  color: ${isDelay ? colors.RED : colors.TEAL};
  ${fontSizes.SMALL};
  ${presets.ELLIPSIS};
  font-weight: bold;
  text-align: center;
`;

export default DelayStyle;
