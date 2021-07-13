// @flow
import { css } from 'react-emotion';

export const ItemWrapperStyle: string = css`
  position: relative;
`;

export const MilestoneWrapperStyle: string = css`
  position: absolute;
  top: -25px;
  right: -15px;
`;

export const MilestoneNameStyle: string = css`
  display: flex;
  width: 195px;
  height: 181px;
  padding: 5px 20px 0 5px;
`;

export const DisabledMilestoneCardStyle: string = css`
  position: relative;
  > div:first-of-type {
    background: #e5e5e5;
  }
  .tooltip-box {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 1;
  }
`;
