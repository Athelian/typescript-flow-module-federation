// @flow
import { css } from 'react-emotion';
import { presets, borderRadiuses, scrollbars } from 'styles/common';

export const TimelineSectionWrapperStyle = css`
  ${presets.BOX};
  width: 880px;
  height: 600px;
  display: flex;
`;

export const TimelineWrapperStyle = css`
  ${borderRadiuses.MAIN};
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  display: flex;
  flex-direction: column;
  box-shadow: 5px 0 15px rgba(0, 0, 0, 0.1);
  width: 210px;
`;

export const BodyWrapperStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  height: 600px;
  ${scrollbars.SMALL};
  overflow: hidden;
  &:hover {
    overflow-x: hidden;
    overflow-y: overlay;
  }
`;
