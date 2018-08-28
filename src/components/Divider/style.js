// @flow
import { css } from 'react-emotion';

export const DividerStyle = (lineWidth: ?string = '1px', color: ?string = '#fff') => css`
  height: ${lineWidth};
  background-color: ${color};
  width: 100%;
`;

export default DividerStyle;
