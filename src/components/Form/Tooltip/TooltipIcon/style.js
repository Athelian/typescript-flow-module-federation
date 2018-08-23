// @flow
import { css } from 'react-emotion';
import { colors, fontSizes } from 'styles/common';

export const IconStyle = (color: string) => css`
  color: ${colors[color]};
  cursor: pointer;
  ${fontSizes.SMALL};
`;

export default IconStyle;
