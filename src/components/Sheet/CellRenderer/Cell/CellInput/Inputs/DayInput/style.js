// @flow
import { css } from 'react-emotion';
import { colors, fontSizes, layout } from 'styles/common';

export const DayInputStyle = css`
  ${layout.HORIZONTAL};
  ${layout.CENTER};
`;

export const DayStyle = css`
  ${fontSizes.MAIN};
  color: ${colors.BLACK};
  font-weight: bold;
  padding: 0 5px 0 0;
  width: 35px;
  user-select: none;
`;
