// @flow
import { css } from 'react-emotion';
import { layout, borderRadiuses, colors } from 'styles/common';

export const AssignedAndApprovalWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 10px;
  background-color: ${colors.GRAY_SUPER_LIGHT};
  ${borderRadiuses.MAIN};
  padding: 5px 0 10px 0;
`;

export default AssignedAndApprovalWrapperStyle;
