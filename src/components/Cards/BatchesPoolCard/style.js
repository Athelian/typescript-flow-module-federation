// @flow
import { css } from 'react-emotion';
import { fontSizes, fontSizesWithHeights, colors, presets, borderRadiuses } from 'styles/common';

export const BatchesPoolCardWrapperStyle: string = css`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 195px;
  height: 80px;
`;

export const ProductImageStyle: string = css`
  ${borderRadiuses.MAIN};
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

export const InfoWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  ${borderRadiuses.MAIN};
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
`;

export const TitleStyle: string = css`
  ${fontSizesWithHeights.MAIN};
  color: ${colors.WHITE};
  font-weight: bold;
  ${presets.ELLIPSIS};
  padding: 5px 0 0 10px;
  width: 175px;
`;

export const DescriptionStyle: string = css`
  ${fontSizesWithHeights.SMALL};
  color: ${colors.WHITE};
  ${presets.ELLIPSIS};
  padding: 0 0 0 10px;
`;

export const TotalBatchesWrapperStyle: string = css`
  display: flex;
  margin-top: auto;
  color: ${colors.WHITE};
  padding: 0 10px 5px 10px;
  align-items: center;
`;

export const TotalBatchesLabelStyle: string = css`
  letter-spacing: 2px;
  ${presets.ELLIPSIS};
  ${fontSizes.SMALL};
`;

export const TotalBatchesStyle: string = css`
  ${presets.ELLIPSIS};
  font-weight: bold;
  margin-left: auto;
  ${fontSizes.MAIN};
`;
