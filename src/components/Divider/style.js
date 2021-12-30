// @flow
import { css } from 'react-emotion';
import { colors } from 'styles/common';

export const DividerStyle = (height: string, color: string, margin: string): string => css`
  height: ${height};
  background-color: ${colors[color]};
  width: 100%;
  margin: ${margin} 0;
`;

export default DividerStyle;
