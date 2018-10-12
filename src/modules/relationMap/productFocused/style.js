import styled, { css } from 'react-emotion';
import { colors, layout, borderRadiuses } from 'styles/common';

export const ProductFocusContent = css`
  background-color: ${colors.WHITE};
  padding: 20px 10px;
`;

export const Row = styled('div')`
  ${layout.HORIZONTAL};
  margin: 0 0 20px 0;
`;

export const BatchListWrapperStyle = css`
  margin-left: 5px;
  padding: 10px;
  ${layout.GRID_HORIZONTAL};
  grid-gap: 5px;
  ${borderRadiuses.MAIN};
  overflow-x: auto;
  align-items: center;
  background-color: #dddddd;
`;
