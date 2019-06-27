// @flow
import { css } from 'react-emotion';
import { layout, shadows, colors, transitions, borderRadiuses } from 'styles/common';

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
