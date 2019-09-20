// @flow
import { css } from 'react-emotion';
import { shadows } from 'styles/common';

export const MilestoneColumnWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 235px;
  ${shadows.HEADER};
`;

export default MilestoneColumnWrapperStyle;
