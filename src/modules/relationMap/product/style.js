// @flow
import { css } from 'react-emotion';
import { layout, scrollbars } from 'styles/common';

export const WrapperStyle: string = css`
  height: 100vh;
  overflow: auto;
`;

export const ProductListWrapperStyle: string = css`
  overflow-x: hidden;
  overflow-y: auto;
  ${scrollbars.MAIN};
  min-height: 0;
  display: grid;
  ${layout.GRID_VERTICAL};
  grid-gap: 20px;
  padding: 20px 20px 100px 20px;
`;
