// @flow
import { css } from 'react-emotion';
import { colors, layout } from 'styles/common';

export const IconStyle = (color: string) => css`
  background: ${colors[color]};
  color: #fff;
  display: flex;
  ${layout.CENTER_CENTER};
  width: 40px;
  height: 40px;
`;

export default IconStyle;
