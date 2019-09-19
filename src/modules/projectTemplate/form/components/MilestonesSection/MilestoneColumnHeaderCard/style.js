// @flow
import { css } from 'react-emotion';
import {
  layout,
  shadows,
  colors,
  transitions,
  borderRadiuses,
  presets,
  fontSizes,
} from 'styles/common';

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

export const DeleteButtonStyle = (isHovered: boolean) => css`
  position: absolute;
  bottom: 10px;
  left: 10px;
  ${presets.BUTTON};
  opacity: ${isHovered ? 1 : 0};
  height: 20px;
  width: 20px;
  ${borderRadiuses.CIRCLE};
  color: ${colors.GRAY_LIGHT};
  ${fontSizes.MAIN};
  &:hover,
  :focus {
    color: ${colors.RED};
  }
`;

export const TaskRingWrapperStyle = css`
  position: absolute;
  right: 10px;
  bottom: 10px;
`;

export const AutoDateSyncIconStyle: string = css`
  position: absolute;
  right: 0px;
  top: 0;
  width: 20px;
  height: 20px;
  color: ${colors.GRAY_VERY_LIGHT};
  display: flex;
  align-items: center;
  justify-content: center;
  ${fontSizes.SMALL};
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

export const CompleteButtonStyle: string = css`
  ${presets.BUTTON};
  ${borderRadiuses.BUTTON};
  height: 40px;
  width: 160px;
  border: 2px solid ${colors.TRANSPARENT};
  margin: 5px 0;
  background-color: ${colors.GRAY_SUPER_LIGHT};
  color: ${colors.GRAY_DARK};
  ${fontSizes.SMALL};
  letter-spacing: 2px;
  user-select: none;
  text-transform: uppercase;
  text-align: center;
  cursor: default;
`;
