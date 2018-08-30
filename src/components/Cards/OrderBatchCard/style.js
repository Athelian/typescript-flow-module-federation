// @flow
import { css } from 'react-emotion';
import { layout, colors, presets, borderRadiuses } from 'styles/common';

export const OrderBatchCardWrapperStyle = css`
  ${layout.GRID_VERTICAL};
  grid-gap: 5px;
  padding: 5px 0;
  width: 195px;
  height: 211px;
`;

export const BatchNoWrapperStyle = css`
  padding: 0 5px;
  width: 100%;
`;

export const QuantityWrapperStyle = css`
  display: grid;
  grid-template-columns: 95px 90px;
  width: 100%;
  padding: 0 5px;
`;

export const DeliveryDateWrapperStyle = css`
  display: grid;
  grid-template-columns: 95px 90px;
  width: 100%;
  padding: 0 5px;
`;

export const DividerStyle = css`
  height: 1px;
  background-color: ${colors.GRAY_VERY_LIGHT};
  margin: 0 10px;
`;

export const TotalPriceWrapperStyle = css`
  display: grid;
  grid-template-columns: 90px 90px;
  width: 100%;
  padding: 0 10px 0 5px;
`;

export const VolumeWrapperStyle = css`
  display: grid;
  grid-template-columns: 90px 90px;
  width: 100%;
  padding: 0 10px 0 5px;
`;

export const ShipmentWrapperStyle = css`
  display: grid;
  grid-template-columns: 20px 1fr;
  width: 100%;
  padding: 0 10px;
  align-items: center;
  grid-gap: 5px;
`;

export const ShipmentIconStyle = (hasShipment: boolean) => css`
  ${presets.BUTTON};
  ${borderRadiuses.CIRCLE};
  width: 20px;
  height: 20px;
  background-color: ${hasShipment ? colors.TEAL : colors.GRAY_LIGHT};
  color: ${colors.WHITE};
  font-size: 11px;
  ${hasShipment &&
    `
      &:hover, :focus {
        background-color: ${colors.TEAL_DARK};
      }
    `};
`;

export const WarehouseArrivalWrapperStyle = css`
  display: grid;
  grid-template-columns: 20px 1fr 1fr;
  width: 100%;
  padding: 0 10px;
  align-items: center;
`;

export const WarehouseArrivalIconStyle = (warehouseArrivalApproved: boolean) => css`
  ${presets.BUTTON};
  ${borderRadiuses.CIRCLE};
  width: 20px;
  height: 20px;
  border: 1px solid ${warehouseArrivalApproved ? colors.TEAL : colors.GRAY_LIGHT};
  color: ${warehouseArrivalApproved ? colors.TEAL : colors.GRAY_LIGHT};
  font-size: 11px;
`;

export const BatchTagsWrapperStyle = css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 5px;
  padding: 0 10px;
  overflow: hidden;
`;
