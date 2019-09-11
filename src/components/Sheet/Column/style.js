// @flow
import { css } from 'react-emotion';
import { fontSizes, layout, colors, borderRadiuses, presets } from 'styles/common';

export const ColumnStyle = (color: string, width: number) => css`
  ${layout.HORIZONTAL};
  ${layout.CENTER};
  position: relative;
  overflow: hidden;
  min-width: ${width}px;
  max-width: ${width}px;
  padding: 5px 9px 5px 5px;
  border-top: 4px solid ${color};
`;

export const TitleStyle = css`
  ${presets.ELLIPSIS};
  ${fontSizes.SMALL};
  color: ${colors.GRAY_DARK};
  line-height: 15px;
  letter-spacing: 2px;
  text-transform: uppercase;
  white-space: nowrap;
  user-select: none;
  margin-right: 5px;
  flex: 1;
`;

export const SortButtonStyle = (active: boolean) => css`
  ${presets.BUTTON};
  ${borderRadiuses.MAIN};
  ${fontSizes.MAIN};
  width: 30px;
  height: 30px;
  color: ${active ? colors.TEAL : 'rgba(0, 0, 0, 0.1)'};

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
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
