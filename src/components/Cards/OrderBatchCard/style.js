// @flow
import { css } from 'react-emotion';
import { layout, colors, presets, borderRadiuses, fontSizes } from 'styles/common';

export const OrderBatchCardWrapperStyle: string = css`
  ${layout.GRID_VERTICAL};
  grid-gap: 5px;
  padding: 5px 0 10px 0;
  width: 195px;
  height: 311px;
`;

export const BatchNoWrapperStyle: string = css`
  padding: 0 5px;
  width: 100%;
`;

export const QuantityWrapperStyle: string = css`
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
  grid-template-columns: 90px 95px;
  width: 100%;
  padding: 0 5px;
`;

export const VolumeWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 90px 95px;
  width: 100%;
  padding: 0 5px;
`;

export const ShipmentWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 20px 155px;
  width: 100%;
  padding: 0 10px;
  align-items: center;
`;

export const ContainerWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 20px 155px;
  width: 100%;
  padding: 0 10px;
  align-items: center;
`;

export const WarehouseArrivalWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 20px 63px 76px 16px;
  height: 20px;
  width: 100%;
  align-items: center;
  padding: 0 0 0 10px;
`;

export const WarehouseArrivalIconStyle: string = css`
  ${presets.BUTTON};
  ${borderRadiuses.MAIN};
  width: 20px;
  height: 20px;
  border: 1px solid ${colors.GRAY_VERY_LIGHT};
  color: ${colors.GRAY_VERY_LIGHT};
  font-size: 11px;
`;

export const ApprovalIconStyle = (approval: boolean): string => css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 20px;
  ${fontSizes.MAIN};
  color: ${approval ? colors.BLUE : colors.GRAY_LIGHT};
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
