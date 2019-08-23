// @flow
import { css } from 'react-emotion';
import { layout } from 'styles/common';

export const CellStyle = ({
  width,
  height,
  focused,
  wrapped,
  topBorder,
  rightBorder,
  bottomBorder,
  leftBorder,
}: {
  width: number,
  height: number,
  focused: boolean,
  wrapped: boolean,
  topBorder: boolean,
  rightBorder: boolean,
  bottomBorder: boolean,
  leftBorder: boolean,
}) => {
  return css`
    width: ${width}px;
    height: ${height}px;
    position: absolute;
    top: 0;
    left: 0;
    border: 2px dashed transparent;
    ${wrapped &&
      `
    border-top-color: ${topBorder ? 'blue' : 'transparent'};
    border-right-color: ${rightBorder ? 'blue' : 'transparent'};
    border-bottom-color: ${bottomBorder ? 'blue' : 'transparent'};
    border-left-color: ${leftBorder ? 'blue' : 'transparent'};
  `}
    ${focused && ` border-style: solid;`}
  `;
};

export const EmptyCellStyle = ({
  width,
  height,
  focused,
}: {
  width: number,
  height: number,
  focused: boolean,
}) => {
  return css`
    width: ${width}px;
    height: ${height}px;
    position: absolute;
    top: 0;
    left: 0;
    border: 2px solid transparent;
    ${focused &&
      `
    border-top-color: blue;
    border-right-color: blue;
    border-bottom-color: blue;
    border-left-color: blue;
  `}
  `;
};

export const HeaderWrapperStyle = css``;

export const HeaderStyle = (width: number) => css`
  position: sticky !important;
  position: -webkit-sticky !important;
  z-index: 2;
  ${layout.GRID_HORIZONTAL};
  height: 35px;
  width: ${width}px;
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
  opacity: 0;
  width: 3px;
  cursor: col-resize;
  z-index: 2;
  &:hover {
    opacity: 0.5;
    z-index: 2;
  }
`;
