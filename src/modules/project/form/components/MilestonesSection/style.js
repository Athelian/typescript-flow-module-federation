// @flow
import { css } from 'react-emotion';
import { shadows, colors, layout } from 'styles/common';

export const NavbarStyle = css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 20px;
  align-items: center;
  width: 100%;
  height: 50px;
  background: ${colors.WHITE};
  ${shadows.HEADER};
  z-index: 2;
`;

export default NavbarStyle;
