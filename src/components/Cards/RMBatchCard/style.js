// @flow
import { css } from 'react-emotion';
import { colors, fontSizes, presets, borderRadiuses } from 'styles/common';

export const RMBatchCardWrapperStyle: string = css`
  display: flex;
  width: 290px;
  height: 40px;
`;

export const ProductImageStyle: string = css`
  height: 40px;
  width: 40px;
  ${borderRadiuses.MAIN};
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  object-fit: cover;
`;

export const InfoWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  width: 135px;
`;

export const NameWrapperStyle: string = css`
  width: 100%;
`;

export const DeliveryWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 74px 1fr;
  width: 100%;
  padding: 0 5px 0 0;
  ${fontSizes.SMALL};
  line-height: 20px;
  color: ${colors.BLACK};
  ${presets.ELLIPSIS};
`;

export const DataWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 115px;
  padding: 0 5px 0 0;
`;

export const DataRowStyle: string = css`
  display: grid;
  grid-template-columns: 36px 1fr;
  width: 100%;
`;
