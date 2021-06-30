// @flow
import { css } from 'react-emotion';
import { scrollbars } from 'styles/common';

export const MilestonesSectionWrapperStyle: string = css`
  display: flex;
  flex: 1;
  width: 100%;
  overflow-y: hidden;
  overflow-x: overlay;
  ${scrollbars.MAIN};
`;

export const DisabledMilestoneWrapper: string = css`
  position: relative;
  button {
    color: #d6d6d6;
    border-color: #d6d6d6;
  }
  .tooltip-box {
    width: 100%;
    height: 180px;
    position: absolute;
    top: 0;
    left: 0;
  }
`;

export default MilestonesSectionWrapperStyle;
