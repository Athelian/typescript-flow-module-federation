// @flow
import { css } from 'react-emotion';
import { presets, borderRadiuses, scrollbars, colors } from 'styles/common';

export const TimelineSectionWrapperStyle: string = css`
  ${presets.BOX};
  width: 880px;
  height: 650px;
  display: flex;
`;

export const TimelineWrapperStyle: string = css`
  ${borderRadiuses.MAIN};
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  display: flex;
  flex-direction: column;
  box-shadow: 5px 0 15px rgba(0, 0, 0, 0.1);
  width: 210px;
`;

export const BodyWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  height: 650px;
  ${scrollbars.SMALL};
  overflow: hidden;
  &:hover {
    overflow-x: hidden;
    overflow-y: overlay;
  }
`;

export const WarehouseArrivalInfoIconStyle: string = css`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: -40px;
  top: -80px;
  color: ${colors.GRAY_LIGHT};
  width: 40px;
  height: 40px;
`;
