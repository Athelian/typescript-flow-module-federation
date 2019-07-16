// @flow
import { css } from 'react-emotion';
import { scrollbars, transitions } from 'styles/common';

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
