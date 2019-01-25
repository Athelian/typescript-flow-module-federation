// @flow
import { css } from 'react-emotion';
import { colors, shadows, layout } from 'styles/common';

export const ContainersSummaryNavbarWrapperStyle: string = css`
  position: relative;
  display: flex;
  background-color: ${colors.WHITE};
  ${shadows.HEADER};
  height: 100px;
  width: 100%;
  z-index: 1;
`;

export const LeftAreaWrapperStyle: string = css`
  position: relative;
  display: flex;
  ${shadows.HEADER_RIGHT};
  flex: 1;
  background-color: ${colors.WHITE};
  align-items: flex-end;
  padding: 10px;
`;

export const ColumnWrapperStyle: string = css`
  ${layout.GRID_VERTICAL};
  grid-gap: 10px;
  flex: 1;
`;

export const RightAreaWrapperStyle: string = css`
  ${layout.GRID_VERTICAL};
  grid-gap: 10px;
  ${shadows.HEADER_LEFT};
  flex: 1;
  background-color: ${colors.WHITE};
  padding: 10px;
`;
