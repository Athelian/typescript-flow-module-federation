// @flow
import { css } from 'react-emotion';
import { fontSizes, colors, presets } from 'styles/common';

export const LineNumberStyle = (height: string): string => css`
  text-align: center;
  width: 100%;
  ${presets.ELLIPSIS};
  color: ${colors.GRAY_DARK};
  ${fontSizes.SMALL};
  height: ${height};
  padding: 12px 0 0 0;
`;

export default LineNumberStyle;
