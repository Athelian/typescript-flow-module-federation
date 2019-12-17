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

export const SortFilterWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 20px;
  align-items: center;
  padding: 0 20px;
  z-index: 3;
`;

export const SortWrapperStyle: string = css`
  display: flex;
  align-items: center;
`;

export const GroupFilterWrapperStyle: string = css`
  display: flex;
  align-items: center;
`;
