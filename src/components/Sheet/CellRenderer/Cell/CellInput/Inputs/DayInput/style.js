// @flow
import { css } from 'react-emotion';
import { colors, fontSizes } from 'styles/common';

export const DayStyle = css`
  ${fontSizes.MAIN};
  color: ${colors.BLACK};
  font-weight: bold;
  width: 35px;
  user-select: none;
`;
