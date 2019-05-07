// @flow
import { css } from 'react-emotion';
import { layout, scrollbars } from 'styles/common';

export const WrapperStyle: string = css`
  height: 100%;
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
  ${scrollbars.MAIN};
`;

export const ProductListWrapperStyle: string = css`
  min-height: 0;
  display: grid;
  ${layout.GRID_VERTICAL};
  grid-gap: 20px;
  padding: 20px 20px 100px 20px;
`;
