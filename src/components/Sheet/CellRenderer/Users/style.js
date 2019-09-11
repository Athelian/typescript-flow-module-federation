// @flow
import { css } from 'react-emotion';
import { layout, colors, fontSizes } from 'styles/common';

export const WrapperStyle = (onFirstRow: boolean, size: number) => css`
  ${layout.LAYOUT};
  ${layout.HORIZONTAL};
  position: absolute;
  ${onFirstRow ? `top: ${size * 30}px;` : `bottom: 30px;`}
  left: 0px;
  z-index: 4;
`;

export const UserStyle = (onFirstRow: boolean) => css`
  background-color: ${colors.BLUE};
  border-radius: ${onFirstRow ? '0px 0px 5px 5px' : '5px 5px 0px 0px'};
  color: ${colors.WHITE};
  ${fontSizes.SMALL};
  line-height: 15px;
  padding: 0 5px;
  white-space: nowrap;
`;
