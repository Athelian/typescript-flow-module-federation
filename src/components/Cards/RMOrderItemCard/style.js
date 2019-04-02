// @flow
import { css } from 'react-emotion';
import { colors, fontSizesWithHeights, presets, borderRadiuses } from 'styles/common';

export const RMOrderItemCardWrapperStyle: string = css`
  display: flex;
  width: 290px;
  height: 40px;
`;

export const ProductImageStyle: string = css`
  height: 40px;
  width: 40px;
  ${borderRadiuses.MAIN};
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  object-fit: cover;
`;

export const InfoWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  width: 115px;
`;

export const NameWrapperStyle: string = css`
  width: 100%;
`;

export const SerialWrapperStyle: string = css`
  width: 100%;
  padding: 0 5px;
  ${fontSizesWithHeights.SMALL};
  color: ${colors.BLACK};
  ${presets.ELLIPSIS};
`;

export const ChartWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 115px;
  padding: 0 5px 0 0;
`;
