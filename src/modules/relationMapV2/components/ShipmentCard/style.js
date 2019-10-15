// @flow
import { css } from 'react-emotion';
import { SHIPMENT_WIDTH } from 'modules/relationMapV2/constants';
import { layout, borderRadiuses, presets, colors, shadows, fontSizes } from 'styles/common';

export const ShipmentCardWrapperStyle = (isShipmentFocus: boolean) => css`
  display: flex;
  flex-direction: column;
  width: ${isShipmentFocus ? SHIPMENT_WIDTH + 150 : SHIPMENT_WIDTH}px;
  height: 55px;
  &:hover > button {
    opacity: 1;
  }
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

export const CreateContainerBtnStyle: string = css`
  opacity: 0;
  position: absolute;
  bottom: -10px;
  left: calc(100% - 10px);
  ${presets.BUTTON};
  width: 20px;
  height: 20px;
  background-color: ${colors.CONTAINER};
  color: ${colors.WHITE};
  ${fontSizes.SMALL};
  ${borderRadiuses.BUTTON};
  z-index: 2;
  justify-content: flex-start;
  overflow: hidden;
  ${shadows.INPUT};
  &:hover {
    width: 45px;
  }
`;

export const CreateContainerIconStyle: string = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
`;
