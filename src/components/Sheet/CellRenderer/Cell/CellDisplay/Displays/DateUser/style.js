// @flow
import { css } from 'react-emotion';
import { colors, fontSizes, layout } from 'styles/common';

export const WrapperStyle = css`
  ${layout.LAYOUT};
  ${layout.HORIZONTAL};
  ${layout.CENTER};
  padding: 5px;
`;

export const DateStyle = css`
  color: ${colors.BLACK};
  ${fontSizes.MAIN};
  margin-right: 10px;
`;
