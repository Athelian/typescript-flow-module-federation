// @flow
import { css } from 'react-emotion';
import { transitions } from './common';

export const AppWrapperStyle: string = css``;

export const DesktopWrapperStyle = (isSideBarExpanded?: boolean): string => css`
  ${transitions.MAIN};
  min-height: 100vh;
  height: 100%;
  margin-left: ${isSideBarExpanded ? '200px' : '50px'};
  margin-left: ${isSideBarExpanded === undefined && '0px'};
  background: #eee;
`;
