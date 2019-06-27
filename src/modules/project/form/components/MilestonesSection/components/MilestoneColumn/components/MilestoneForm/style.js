// @flow
import { css } from 'react-emotion';
import { layout, shadows, colors, transitions, borderRadiuses } from 'styles/common';

export const TrashIconStyle = (isHover: boolean) => css`
  ${isHover
    ? `
    opacity: 1;
    height: 20px;
  `
    : `
    opacity: 0;
    height: 0px;
  `};
  position: absolute;
  right: 0;
  top: 0;
  width: fit-content;
  cursor: pointer;
  z-index: 4;
`;

export const RingIconStyle = css`
  position: absolute;
  right: 0;
  bottom: 0;
  width: fit-content;
  height: fit-content;
  cursor: pointer;
  z-index: 4;
`;

export const MilestoneHeaderWrapperStyle = (isDragging: boolean) => css`
  ${layout.GRID_VERTICAL};
  grid-gap: 10px;
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

export default MilestoneHeaderWrapperStyle;
