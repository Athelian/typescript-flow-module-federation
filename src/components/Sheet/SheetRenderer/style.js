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

export const StickiesWrapperStyle: string = css`
  ${layout.HORIZONTAL};
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

export const StickyStyle = (color: string): string => css`
  position: sticky;
  top: 0px;
  left: 0px;
  z-index: 100;
  width: min-content;
  padding: 0 5px;
  background: ${color};
  border-radius: 0px 5px 5px 0px;
  color: white;
  font-size: 12px;
  line-height: 15px;
  letter-spacing: 2px;
  text-transform: uppercase;
  user-select: none;
  white-space: nowrap;
`;

export const GridStyle: string = css`
  ${scrollbars.MAIN};
`;

export const InnerGridStyle: string = css`
  position: relative;
`;
