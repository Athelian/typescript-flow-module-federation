// @flow
import { css } from 'react-emotion';
import { scrollbars, transitions } from 'styles/common';

export const LayoutWrapperStyle: string = css`
  height: 100vh;
  width: 100%;
  overflow: hidden;
  position: relative;
`;

export const ContentWrapperStyle: string = css`
  height: calc(100vh - 50px);
  width: 100%;
  min-width: min-content;
  overflow-x: hidden;
  overflow-y: auto;
  ${scrollbars.MAIN};
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  ${transitions.EXPAND};
`;
