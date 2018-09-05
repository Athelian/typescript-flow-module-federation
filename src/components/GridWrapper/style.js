// @flow
import { css } from 'react-emotion';
import { layout } from 'styles/common';

export const GridWrapperStyle = (direction: 'column' | 'row', gap: number) => css`
  ${direction === 'row' ? layout.GRID_HORIZONTAL : layout.GRID_VERTICAL};
  grid-gap: ${gap};
`;

export default GridWrapperStyle;
