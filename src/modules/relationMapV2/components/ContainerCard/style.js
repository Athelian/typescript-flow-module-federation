// @flow
import { css } from 'react-emotion';
import { layout, borderRadiuses } from 'styles/common';

export const ContainerCardWrapperStyle = css`
  display: flex;
  flex-direction: column;
  width: 375px;
  height: 55px;
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
