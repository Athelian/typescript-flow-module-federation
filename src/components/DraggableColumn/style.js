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

export const NewLabelStyle: string = css`
  height: 18px;
  margin: 6px 0;
  font-size: 12px;
  line-height: 15px;
  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: ${colors.WHITE};
  background: rgba(17, 209, 166, 0.5);
  border-radius: 5px;
`;
