// @flow
import { css } from 'react-emotion';
import { layout, colors, presets, borderRadiuses, fontSizes } from 'styles/common';

export const ProductBatchCardWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 195px;
  height: 209px;
`;

export const BatchInfoWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 185px;
  grid-gap: 5px;
  padding: 5px;
  width: 195px;
`;

export const BatchNoWrapperStyle: string = css`
  width: 100%;
`;

export const DividerStyle: string = css`
  height: 1px;
  background-color: ${colors.GRAY_VERY_LIGHT};
  margin: 0 5px;
`;

export const OrderWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 20px 160px;
  width: 100%;
  padding: 0 5px;
  align-items: center;
`;

export const ShipmentWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 20px 160px;
  width: 100%;
  padding: 0 5px;
  align-items: center;
`;

export const ContainerWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 20px 160px;
  width: 100%;
  padding: 0 5px;
  align-items: center;
`;

export const WarehouseArrivalWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 20px 66px 76px 18px;
  width: 100%;
  align-items: center;
  padding: 0 0 0 5px;
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

export const BatchTagsWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  ${borderRadiuses.MAIN};
  grid-gap: 5px;
  width: 155px;
  margin: 0 5px;
  overflow: hidden;
`;

export const TagsLineStyle: string = css`
  display: grid;
  grid-template-columns: 165px 20px;
`;
