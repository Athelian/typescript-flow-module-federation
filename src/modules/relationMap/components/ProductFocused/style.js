import styled, { css } from 'react-emotion';
import { layout, borderRadiuses } from 'styles/common';

export const Row = styled('div')`
  ${layout.HORIZONTAL};
  margin: 20px 0;
`;

export const BatchListWrapperStyle = css`
  height: min-content;
  ${layout.GRID_HORIZONTAL};
  grid-gap: 20px;
  ${borderRadiuses.MAIN};
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  overflow-x: auto;
`;
