// @flow
import { css } from 'react-emotion';
import { colors } from 'styles/common';

export const LineStyle = (color: string) => css`
  height: 2px;
  background-color: ${colors[color]};
  width: 100%;
`;

export default LineStyle;
