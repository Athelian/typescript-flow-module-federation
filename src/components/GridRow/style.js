// @flow
import { css } from 'react-emotion';
import { layout } from 'styles/common';

export const GridRowWrapperStyle = (gap: string): string => css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: ${gap};
`;

export default GridRowWrapperStyle;
