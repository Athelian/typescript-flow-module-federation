// @flow
import { css } from 'react-emotion';
import { layout, colors, fontSizes } from 'styles/common';

export const WrapperStyle = css`
  ${layout.HORIZONTAL};
  z-index: 1;
`;

export const IconStyle = css`
  ${layout.LAYOUT};
  ${layout.CENTER_CENTER};
  ${fontSizes.LARGE};
  background-color: #fff;
  color: ${colors.GRAY_VERY_LIGHT};
  width: 50px;
  height: 20px;
  margin: 0 20px 0 0;
  flex-shrink: 0;
`;
