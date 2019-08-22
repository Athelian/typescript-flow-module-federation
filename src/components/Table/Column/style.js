// @flow
import { css } from 'react-emotion';
import { fontSizes, layout, colors } from 'styles/common';

export const ColumnStyle = (width: number) => css`
  ${layout.HORIZONTAL};
  ${layout.CENTER};
  position: relative;
  overflow: hidden;
  min-width: ${width}px;
  padding: 5px 15px;
  border-right: 0.5px solid rgba(0, 0, 0, 0.1);

  &:hover {
    border: none;

    & > div {
      display: block;
    }
  }
`;

export const TitleStyle = css`
  color: ${colors.GRAY_DARK};
  ${fontSizes.SMALL};
  line-height: 15px;
  letter-spacing: 2px;
  text-transform: uppercase;
`;

export const DragHandleStyle = (dragging: boolean) => css`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  display: none;
  background-color: rgba(0, 0, 0, 0.1);
  width: 4px;
  cursor: col-resize;
  z-index: 3;

  ${dragging &&
    `
    display: block;
  `}
`;
