// @flow
import { css } from 'react-emotion';
import { colors, layout, fontSizes } from 'styles/common';

export const IconStyle = (color: string): string => css`
  background: ${colors[color]};
  color: #fff;
  display: flex;
  ${layout.CENTER_CENTER};
  width: 50px;
  height: 50px;
  ${fontSizes.HUGE};
`;

export default IconStyle;
