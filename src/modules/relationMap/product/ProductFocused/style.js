// @flow
import styled, { css } from 'react-emotion';
import { colors, layout, borderRadiuses } from 'styles/common';

export const Row = styled('div')`
  display: grid;
  grid-template-columns: min-content 1fr;
`;

export const BatchListWrapperStyle = css`
  margin-left: 5px;

  overflow-x: auto;
  align-items: center;
  background-color: ${colors.WHITE};

  > div:last-child {
    margin-right: 10px;
  }
`;

export const BatchListStyle = css`
  padding: 10px;
  ${borderRadiuses.MAIN};
  ${layout.GRID_HORIZONTAL};
  grid-gap: 5px;
  background-color: ${colors.GRAY_VERY_LIGHT};
  width: min-content;
`;
