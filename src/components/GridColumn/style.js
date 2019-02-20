// @flow
import { css } from 'react-emotion';
import { layout } from 'styles/common';

export const GridColumnWrapperStyle = (gap: string): string => css`
  ${layout.GRID_VERTICAL};
  grid-gap: ${gap};
`;

export default GridColumnWrapperStyle;
