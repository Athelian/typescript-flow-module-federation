// @flow
import { css } from 'react-emotion';
import { layout } from 'styles/common';

export const PriceRangeWrapperStyle: string = css`
  ${layout.GRID_VERTICAL};
  grid-gap: 20px;
  width: 100%;
  padding: 20px;
`;

export const NumberInputsWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 200px 200px;
  grid-gap: 20px;
  width: 100%;
`;
