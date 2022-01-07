// @flow
import { css } from 'react-emotion';
import { layout } from 'styles/common';

export const GridColumnWrapperStyle = (gap: string, maxWidth: ?string): string => css`
  ${layout.GRID_VERTICAL};
  grid-gap: ${gap};
  ${maxWidth && `max-width: ${maxWidth}`};
`;

export const GridCenteredStyle: string = css`
  > * {
    margin: auto;
  }
`;

export default GridColumnWrapperStyle;
