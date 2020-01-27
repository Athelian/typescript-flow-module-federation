// @flow
import { css } from 'react-emotion';
import { layout, shadows, colors, transitions, borderRadiuses, fontSizes } from 'styles/common';

export const MilestoneHeaderWrapperStyle = (isDragging: boolean) => css`
  ${layout.GRID_VERTICAL};
  grid-gap: 5px;
  justify-content: center;
  justify-items: center;
  ${transitions.MAIN};
  background-color: ${colors.WHITE};
  ${shadows.HEADER};
  padding: 10px 0;
  position: relative;
  ${isDragging &&
    `
    ${borderRadiuses.MAIN};
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  `}
`;

export const TaskRingWrapperStyle = css`
  position: absolute;
  right: 10px;
  bottom: 10px;
`;

export const AutoDateSyncIconStyle: string = css`
  position: absolute;
  right: 25px;
  top: 0;
  width: 20px;
  height: 20px;
  color: ${colors.GRAY_VERY_LIGHT};
  display: flex;
  align-items: center;
  justify-content: center;
  ${fontSizes.SMALL};
`;

export const DateInputWrapperStyle: string = css`
  position: relative;
`;

export const DiffDateStyle = (diff: number): string => css`
  pointer-events: none;
  position: absolute;
  right: 0;
  top: 0;
  color: ${diff > 0 ? colors.RED : colors.TEAL};
  ${fontSizes.SMALL};
  width: 25px;
  height: 20px;
  font-weight: bold;
  line-height: 20px;
  text-align: center;
`;
