// @flow
import { css } from 'react-emotion';
import { layout } from 'styles/common';

export const ContainersAmountSummaryStyle: string = css`
  ${layout.GRID_VERTICAL};
  grid-gap: 10px;
  width: 100%;
`;

export const RowStyle: string = css`
  display: grid;
  grid-template-columns: 250px 1fr;
  width: 100%;
`;
