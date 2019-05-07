// @flow
import { css } from 'react-emotion';
import { layout } from 'styles/common';

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
