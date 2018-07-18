// @flow
import { css } from 'react-emotion';
import { transitions } from './common';

export const AppWrapperStyle = css``;

export const DesktopWrapperStyle = (isSideBarExpanded: boolean) => css`
  ${transitions.MAIN};
  min-height: 100vh;
  height: 100%;
  margin-left: ${isSideBarExpanded ? '200px' : '50px'};
  background: #eee;
`;
