// @flow
import { css } from 'react-emotion';
import { colors, shadows, layout } from 'styles/common';

export const TableWrapperStyle: string = css`
  border: 1px solid #d9dddd;
  margin-left: 30px;
  padding: 5px;
`;

export const RowStyle = (isEven: boolean) => css`
  display: flex;
  align-items: center;
  background-color: white;
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
  background-color: ${isEven ? '#f8f8f0' : '#fff'};
`;

export const StickyStyle: string = css`
  position: sticky !important;
  position: -webkit-sticky !important;
  z-index: 2;
  ${layout.GRID_HORIZONTAL};
  height: 50px;
  width: calc(100% - 30px);
  padding: 0 5px;
  margin-left: 30px;
  background: ${colors.WHITE};
  ${shadows.HEADER};
  overflow: hidden;
`;

export const SidebarWrapperStyle: string = css`
  width: 30px;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  padding: 55px 0 45px 0;
  background: ${colors.WHITE};
  ${shadows.HEADER};
  overflow: hidden;
`;
