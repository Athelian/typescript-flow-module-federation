// @flow
import { css } from 'react-emotion';
import { layout, borderRadiuses } from 'styles/common';

export const ShipmentCardWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  width: 515px;
  height: 55px;
`;

export const TopRowWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 165px 315px;
  grid-template-rows: 20px;
  grid-gap: 5px;
  padding: 5px;
`;

export const TagsAndPlaceWrapperStyle: string = css`
  display: flex;
`;

export const TagsWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  ${borderRadiuses.MAIN};
  grid-gap: 5px;
  overflow: hidden;
  flex: 1;
`;

export const BottomRowWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 485px 20px;
  grid-template-rows: 20px;
  grid-gap: 5px;
  padding: 0 0 5px 5px;
`;

export const TimelineAndDateWrapperStyle: string = css`
  display: flex;
`;
