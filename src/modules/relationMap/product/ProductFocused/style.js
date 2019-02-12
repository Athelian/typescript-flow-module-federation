// @flow
import styled, { css } from 'react-emotion';
import { colors, layout, borderRadiuses, scrollbars } from 'styles/common';

export const ProductListWrapperStyle: string = css`
  overflow-x: hidden;
  overflow-y: auto;
  ${scrollbars.MAIN};
  min-height: 0;
  display: grid;
  ${layout.GRID_VERTICAL};
  grid-gap: 20px;
  padding: 20px 20px 100px 20px;
`;

export const ProductFocusContent = css`
  background-color: ${colors.WHITE};
  padding: 20px 10px;
`;

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
