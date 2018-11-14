// @flow
import { css } from 'react-emotion';
import { fontSizes, colors, presets } from 'styles/common';

export const LineNumberStyle: string = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  ${presets.ELLIPSIS};
  color: ${colors.GRAY_DARK};
  ${fontSizes.SMALL};
`;

export default LineNumberStyle;
