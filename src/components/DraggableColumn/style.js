// @flow
import { css } from 'react-emotion';
import { borderRadiuses, colors, fontSizes, shadows, transitions } from 'styles/common';

export const ColumnWrapperStyle = (isDragging: boolean): string => css`
  display: flex;
  align-items: stretch;
  ${borderRadiuses.MAIN};
  background-color: ${colors.WHITE};
  margin-bottom: 10px;
  user-select: none;
  ${isDragging && shadows.INPUT};
  &:hover {
    ${shadows.INPUT};
    & > i {
      opacity: 1;
    }
  }
`;

export const DragHandleStyle = (isDragging: boolean): string => css`
  display: flex;
  align-items: center;
  justify-content: center;
  ${fontSizes.MAIN};
  width: 30px;
  min-height: 30px;
  flex-shrink: 0;
  ${transitions.MAIN};
  ${isDragging
    ? `
    color: ${colors.BLUE};
    opacity: 1;
  `
    : `
    color: ${colors.GRAY_LIGHT};
    opacity: 0;
  `};
  &:hover {
    color: ${colors.BLUE};
    opacity: 1;
  }
`;

export const CheckboxWrapperStyle: string = css`
  padding: 5px 5px 5px 0;
`;
