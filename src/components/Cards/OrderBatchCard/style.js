// @flow
import { css } from 'react-emotion';
import { layout, colors, presets, borderRadiuses } from 'styles/common';

export const OrderBatchCardWrapperStyle: string = css`
  ${layout.GRID_VERTICAL};
  grid-gap: 5px;
  padding: 5px 0 10px 0;
  width: 195px;
  height: 241px;
`;

export const BatchNoWrapperStyle: string = css`
  padding: 0 5px;
  width: 100%;
`;

export const QuantityWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 95px 90px;
  width: 100%;
  padding: 0 5px;
`;

export const DateInputWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 65px 120px;
  width: 100%;
  padding: 0 5px;
`;

export const DividerStyle: string = css`
  height: 1px;
  background-color: ${colors.GRAY_VERY_LIGHT};
  margin: 0 10px;
`;

export const TotalPriceWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 90px 90px;
  width: 100%;
  padding: 0 10px 0 5px;
`;

export const VolumeWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 90px 90px;
  width: 100%;
  padding: 0 10px 0 5px;
`;

export const ShipmentWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 20px 155px;
  width: 100%;
  padding: 0 10px;
  align-items: center;
`;

export const ShipmentIconStyle = (hasShipment: boolean): string => css`
  ${presets.BUTTON};
  ${borderRadiuses.MAIN};
  width: 20px;
  height: 20px;
  background-color: ${hasShipment ? colors.TEAL : colors.GRAY_VERY_LIGHT};
  color: ${colors.WHITE};
  font-size: 11px;
  ${hasShipment &&
    `
      &:hover, :focus {
        background-color: ${colors.TEAL_DARK};
      }
    `};
`;

export const WarehouseArrivalWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 20px 75px 80px;
  width: 100%;
  padding: 0 10px;
  align-items: center;
`;

export const WarehouseArrivalIconStyle = (warehouseArrivalApproved: boolean): string => css`
  ${presets.BUTTON};
  ${borderRadiuses.MAIN};
  width: 20px;
  height: 20px;
  border: 1px solid ${warehouseArrivalApproved ? colors.TEAL : colors.GRAY_VERY_LIGHT};
  color: ${warehouseArrivalApproved ? colors.TEAL : colors.GRAY_VERY_LIGHT};
  font-size: 11px;
`;

export const TagsAndTaskWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 160px 20px;
  grid-gap: 5px;
  align-items: center;
`;

export const BatchTagsWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  ${borderRadiuses.MAIN};
  grid-gap: 5px;
  width: 160px;
  padding: 0 0 0 10px;
  overflow: hidden;
`;
