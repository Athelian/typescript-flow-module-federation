// @flow
import { css } from 'react-emotion';
import { transitions } from 'styles/common';

export const NavBarStyle: string = css`
  display: flex;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  background: #fff;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  z-index: 2;
  ${transitions.EXPAND};
`;

export const ChildrenWrapperStyle: string = css`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: min-content;
  grid-template-rows: 50px;
  grid-gap: 20px;
  align-items: center;
`;
