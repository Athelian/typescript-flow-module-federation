// @flow
import { css } from 'react-emotion';
import { colors } from 'styles/common';

export const DividerStyle = (height: string, color: string): string => css`
  height: ${height};
  background-color: ${colors[color]};
  width: 100%;
`;

export default DividerStyle;
