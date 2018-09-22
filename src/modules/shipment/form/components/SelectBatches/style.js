// @flow
import { css } from 'react-emotion';

export const ItemWrapperStyle: string = css`
  position: relative;
`;

export const NumberBarStyle: string = css`
  position: absolute;
  top: 30px;
  z-index: 1;
`;

export const GridViewWrapperStyle: string = css`
  height: calc(100vh - 10px);
  overflow: auto;
`;
