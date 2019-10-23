// @flow
import { css } from 'react-emotion';
import { layout, colors, shadows, scrollbars } from 'styles/common';

export const SheetWrapperStyle: string = css`
  ${layout.VERTICAL}
  width: 100%;
  height: 100%;
  background: ${colors.WHITE};
  z-index: 1;
`;

export const ColumnsWrapperStyle: string = css`
  ${layout.HORIZONTAL};
  ${shadows.HEADER};
  position: sticky;
  top: 0;
  left: 0;
  overflow: hidden;
  background: ${colors.WHITE};
  height: 44px;
  z-index: 2;
`;

export const ColumnFillerStyle = (color: string): string => css`
  min-width: 20px;
  border-top: 4px solid ${color};
  flex: 1;
`;

export const GridStyle: string = css`
  ${scrollbars.MAIN};
`;

export const InnerGridStyle: string = css`
  position: relative;
`;
