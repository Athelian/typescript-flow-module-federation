// @flow
import { css } from 'react-emotion';
import { SHIPMENT_WIDTH } from 'modules/relationMapV2/constants';
import { layout, borderRadiuses, fontSizes, colors, presets } from 'styles/common';

export const ShipmentCardWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  width: ${SHIPMENT_WIDTH}px;
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

export const DelayStyle = (delayAmount: number): string => css`
  color: ${delayAmount > 0 ? colors.RED : colors.TEAL};
  ${fontSizes.SMALL};
  ${presets.ELLIPSIS};
  font-weight: bold;
  text-align: center;
  width: 30px;
  height: 20px;
  line-height: 20px;
`;

export const ApprovedIconStyle = (approved: boolean): string => css`
  display: flex;
  align-items: center;
  justify-content: center;
  ${fontSizes.SMALL};
  width: 20px;
  height: 20px;
  color: ${approved ? colors.BLUE : colors.GRAY_SUPER_LIGHT};
`;
