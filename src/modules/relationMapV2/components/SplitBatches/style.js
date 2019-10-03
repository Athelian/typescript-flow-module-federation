// @flow
import { css } from 'react-emotion';
import { layout } from 'styles/common';

export const SplitInputsWrapperStyle: string = css`
  ${layout.GRID_VERTICAL};
  grid-gap: 10px;
`;

export const SplitRowStyle: string = css`
  display: grid;
  grid-template-columns: repeat(3, 200px);
`;
