// @flow
import { css } from 'react-emotion';
import { transitions, shadows } from 'styles/common';

export const NavBarStyle: string = css`
  display: flex;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  background: #fff;
  ${shadows.HEADER};
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

export const RelationMapNavBarChildrenWrapperStyle: string = css`
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: min-content min-content 1fr;
  width: 100%;
  grid-template-rows: 50px;
  grid-gap: 20px;
  align-items: center;
`;
