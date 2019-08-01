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

export const HeaderItemStyle = ({ width }: { width: number }) => css`
  ${width && `width: ${width}px;`}
`;
