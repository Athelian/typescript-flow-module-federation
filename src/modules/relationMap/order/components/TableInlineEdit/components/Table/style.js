// @flow
import { css } from 'react-emotion';
import { colors, shadows, layout, scrollbars } from 'styles/common';

export const TableWrapperStyle: string = css`
  border: 1px solid #d9dddd;
  margin-left: 30px;
  padding: 5px 15px 15px 5px;
  overflow: overlay !important;
  ${scrollbars.MAIN}
`;

export const CellStyle = css`
  display: flex;
  padding: 5px;
`;

export const StickyStyle: string = css`
  position: sticky !important;
  position: -webkit-sticky !important;
  z-index: 2;
  ${layout.GRID_HORIZONTAL};
  height: 50px;
  width: calc(100% - 30px);
  padding: 0 35px 0 5px;
  margin: 0 30px;
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

export const WrapperStyle: string = css`
  display: flex;
  width: 100%;
`;

export const ItemStyle: string = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 30px;
  margin: 5px;
`;
