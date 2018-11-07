// @flow
import { css } from 'react-emotion';
import { colors, layout, fontSizes } from 'styles/common';

export const IconStyle = (color: string, invert: boolean): string => css`
  background: ${invert ? '#fff' : colors[color]};
  color: ${invert ? colors[color] : '#fff'};
  display: flex;
  ${layout.CENTER_CENTER};
  width: 50px;
  height: 50px;
  ${fontSizes.HUGE};
`;

export default IconStyle;
