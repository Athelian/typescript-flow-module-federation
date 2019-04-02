// @flow
import { css } from 'react-emotion';
import { colors, fontSizes, presets } from 'styles/common';

export const RMBatchCardWrapperStyle: string = css`
  display: flex;
  width: 290px;
  height: 40px;
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

export const RelatedWrapperStyle: string = css`
  display: flex;
  align-items: flex-end;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
`;

export const RelatedIconStyle = (isActive: boolean): string => css`
  color: ${isActive ? colors.TEAL : colors.GRAY_LIGHT};
  ${fontSizes.SMALL};
  display: flex;
  width: 20px;
  height: 20px;
  align-items: center;
  justify-content: center;
`;
