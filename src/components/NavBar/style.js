// @flow
import { css } from 'react-emotion';
import { transitions } from 'styles/common';

export const NavBarStyle = (isSideBarExpanded: boolean) => css`
  display: flex;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  background: #fff;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  z-index: 1;
  padding-left: ${isSideBarExpanded ? '200px' : '50px'};
  ${transitions.EXPAND};
`;

export const ChildrenWrapperStyle = css`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: min-content;
  grid-template-rows: 50px;
  grid-gap: 10px;
  align-items: center;
`;
