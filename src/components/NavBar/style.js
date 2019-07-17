// @flow
import { css } from 'react-emotion';
import { transitions, shadows, colors, layout } from 'styles/common';

export const NavBarWrapperStyle: string = css`
  display: flex;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  background: ${colors.WHITE};
  ${shadows.HEADER};
  z-index: 4;
  ${transitions.EXPAND};
`;

export const NavBarStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  grid-template-rows: 50px;
  grid-gap: 20px;
  align-items: center;
  width: 100%;
`;
