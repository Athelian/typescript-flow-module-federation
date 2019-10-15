// @flow
import { css } from 'react-emotion';
import { CONTAINER_WIDTH } from 'modules/relationMapV2/constants';
import { layout, borderRadiuses, fontSizes, colors, presets, shadows } from 'styles/common';

export const ContainerCardWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  width: ${CONTAINER_WIDTH}px;
  height: 55px;
  &:hover > button {
    opacity: 1;
  }
`;

export const TopRowWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 225px 115px;
  grid-template-rows: 20px;
  grid-gap: 5px;
  padding: 5px;
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
  grid-template-columns: 225px 135px;
  grid-template-rows: 20px;
  grid-gap: 5px;
  padding: 0 0 5px 5px;
`;

export const DeliveryWarehouseWrapperStyle: string = css`
  display: flex;
`;

export const DeleteButtonStyle: string = css`
  opacity: 0;
  position: absolute;
  top: -10px;
  right: -10px;
  ${presets.BUTTON};
  width: 20px;
  height: 20px;
  background-color: ${colors.WHITE};
  color: ${colors.GRAY_LIGHT};
  ${fontSizes.SMALL};
  ${borderRadiuses.CIRCLE};
  z-index: 2;
  ${shadows.INPUT};
  &:hover > button {
    color: ${colors.RED};
  }
`;
