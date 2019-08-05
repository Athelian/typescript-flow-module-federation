// @flow
import { css } from 'react-emotion';
import { layout } from 'styles/common';

export const ColumnStyle = css`
  display: inline-block;
  width: 200px;
  overflow: hidden;
`;

export const HeaderWrapperStyle = css``;

export const HeaderStyle = css`
  position: sticky !important;
  position: -webkit-sticky !important;
  z-index: 2;
  ${layout.GRID_HORIZONTAL};
  height: 35px;
  width: calc(100% - 30px);

  overflow: hidden;
`;

export const HeaderItemStyle = (width: number) => css`
  ${width && `width: ${width}px;`}
  position: sticky;
  top: 0;
  text-align: left;
  position: relative;
`;

export const DragHandleIconStyle = css`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  background: black;
  // opacity: 0;
  width: 3px;
  cursor: col-resize;
`;
