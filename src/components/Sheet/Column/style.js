// @flow
import { css } from 'react-emotion';
import { fontSizes, layout, colors } from 'styles/common';

export const ColumnStyle = (color: string, width: number) => css`
  ${layout.HORIZONTAL};
  ${layout.CENTER};
  position: relative;
  overflow: hidden;
  min-width: ${width}px;
  max-width: ${width}px;
  padding: 5px 15px;
  border-top: 4px solid ${color};
`;

export const TitleStyle = css`
  color: ${colors.GRAY_DARK};
  ${fontSizes.SMALL};
  line-height: 15px;
  letter-spacing: 2px;
  text-transform: uppercase;
  white-space: nowrap;
`;

export const DragHandleStyle = (dragging: boolean) => css`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  border-right: ${dragging ? 4 : 1}px solid rgba(0, 0, 0, 0.1);
  cursor: col-resize;
  z-index: 3;

  div:hover > & {
    border-right: 4px solid rgba(0, 0, 0, 0.1);
  }
`;
