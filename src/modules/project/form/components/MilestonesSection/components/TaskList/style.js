// @flow
import { css } from 'react-emotion';
import { colors, layout, scrollbars } from 'styles/common';

export const MilestoneTaskListBodyStyle = css`
  ${layout.GRID_VERTICAL};
  grid-gap: 30px;
  width: 235px;
  flex: 1;
  overflow-x: hidden;
  overflow-y: overlay;
  ${scrollbars.SMALL};
  justify-content: center;
  background-color: ${colors.GRAY_SUPER_LIGHT};
  padding: 30px 0;
`;

export default MilestoneTaskListBodyStyle;
