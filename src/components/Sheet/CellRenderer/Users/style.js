// @flow
import { css } from 'react-emotion';
import { layout, colors, fontSizes } from 'styles/common';

export const WrapperStyle = (onFirstRow: boolean, extended: number) => css`
  ${layout.HORIZONTAL};
  display: none;
  position: absolute;
  ${onFirstRow ? `top: ${(extended + 1) * 30}px;` : `bottom: ${(extended + 1) * 30}px;`}
  left: 0px;
  z-index: 4;

  div:hover > & {
    ${layout.LAYOUT};
  }
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
