// @flow
import { css } from 'react-emotion';

export const DividerStyle = (lineWidth: ?string, color: ?string) => css`
  height: ${lineWidth || '1px'};
  background-color: ${color || '#fff'};
  width: 100%;
`;

export default DividerStyle;
