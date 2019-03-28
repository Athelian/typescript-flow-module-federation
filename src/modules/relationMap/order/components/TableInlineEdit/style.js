// @flow
import { css } from 'react-emotion';
import { colors, shadows, transitions, layout, scrollbars } from 'styles/common';

export const EditTableViewWrapperStyle: string = css`
  position: relative;
  width: 100%;
  height: calc(100% - 50px);
`;

export const NavbarWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 1fr min-content min-content;
  padding: 0 20px;
  grid-gap: 20px;
  align-items: center;
  justify-content: end;
  width: 100%;
  height: 50px;
  ${transitions.EXPAND};
`;

export const HeaderWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  height: 50px;
  width: calc(100% - 30px);
  padding: 0 5px;
  position: absolute;
  top: 0;
  left: 30px;
  background: ${colors.WHITE};
  ${shadows.HEADER};
  overflow: hidden;
`;

export const SidebarWrapperStyle: string = css`
  width: 30px;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  padding: 55px 0 45px 0;
  background: ${colors.WHITE};
  ${shadows.HEADER};
  overflow: hidden;
`;

export const SidebarFadeStyle: string = css`
  width: 30px;
  height: 62px;
  position: absolute;
  top: 0;
  left: 0;
  background: linear-gradient(to bottom, ${colors.WHITE} 80%, ${colors.TRANSPARENT});
`;

export const BodyWrapperStyle: string = css`
  width: calc(100% - 30px);
  height: calc(100% - 50px);
  overflow: auto;
  padding: 5px;
  margin: 50px 0 0 30px;
  ${scrollbars.MAIN};
`;

export const LastTemplateUsedStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  align-items: center;
`;

export const TableHeaderClearFixStyle: string = css`
  width: 20px;
`;
