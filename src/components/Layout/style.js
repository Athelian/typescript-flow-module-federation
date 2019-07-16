// @flow
import { css } from 'react-emotion';
import { scrollbars, transitions, shadows, colors, layout } from 'styles/common';

export const LayoutWrapperStyle: string = css`
  height: 100vh;
  width: 100%;
  overflow: hidden;
  position: relative;
`;

export const ContentWrapperStyle: string = css`
  height: calc(100vh - 50px);
  width: 100%;
  overflow-x: hidden;
  overflow-y: overlay;
  ${scrollbars.MAIN};
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  ${transitions.EXPAND};
`;

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
  & > div {
    ${layout.GRID_HORIZONTAL};
    grid-template-rows: 50px;
    grid-gap: 20px;
    align-items: center;
    width: 100%;
  }
`;
