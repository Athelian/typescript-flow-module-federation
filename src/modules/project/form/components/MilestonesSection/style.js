// @flow
import { css } from 'react-emotion';
import { transitions, shadows, colors, layout } from 'styles/common';

export const NavbarStyle = css`
  ${layout.LAYOUT};
  align-items: center;
  width: 100%;
  height: 50px;
  background: ${colors.WHITE};
  z-index: 4;
  ${shadows.HEADER};
  ${transitions.EXPAND};
`;

export default NavbarStyle;
