// @flow
import { css } from 'react-emotion';
import { scrollbars, transitions, shadows, colors, layout } from 'styles/common';

export const LayoutWrapperStyle: string = css`
  height: 100vh;
  width: 100%;
  overflow: hidden;
  position: relative;
`;

export const ContentWrapperStyle = (notCenter?: boolean, hasSubNavBar?: boolean) => css`
  ${`height: calc(100vh - ${hasSubNavBar ? 100 : 50}px);`}
  ${`margin-top: ${hasSubNavBar ? 100 : 50}px;`}
  width: 100%;
  overflow-x: hidden;
  overflow-y: overlay;
  ${scrollbars.MAIN};
  display: flex;
  flex-direction: column;
  ${!notCenter && `align-items: center;`}
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

export const SubNavBarWrapperStyle: string = css`
  top: 50px;
`;

export const SubNavBarContentWrapperStyle: string = css`
  height: calc(100vh - 100px) !important;
  margin-top: 100px !important;
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

export const SlideViewNavBarStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  grid-template-rows: 50px;
  grid-gap: 20px;
  align-items: center;
  width: 100%;
`;

export const FormLayoutWrapperStyle: string = css`
  ${layout.GRID_VERTICAL};
  grid-gap: 40px;
  padding: 50px 0;
`;
