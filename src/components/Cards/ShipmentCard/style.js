// @flow
import { css } from 'react-emotion';
import {
  colors,
  fontSizesWithHeights,
  presets,
  layout,
  fontSizes,
  borderRadiuses,
} from 'styles/common';

export const ShipmentCardWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 860px;
  height: min-content;
`;

export const ShipmentInfoWrapperStyle: string = css`
  display: flex;
  width: 100%;
  padding: 5px 10px;
`;

export const ShipmentLeftWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  width: 300px;
`;

export const ShipmentNoWrapperStyle: string = css`
  display: flex;
  align-items: center;
`;

export const ShipmentBookedStyle = (booked: boolean) => css`
  ${borderRadiuses.MAIN};
  ${fontSizes.SMALL};
  width: 60px;
  text-align: center;
  background-color: ${booked ? colors.TEAL : colors.GRAY_LIGHT};
  color: ${colors.WHITE};
  height: 16px;
  line-height: 16px;
  margin: 0 5px 0 0;
  flex-shrink: 0;
`;

export const ShipmentNoStyle: string = css`
  ${fontSizesWithHeights.MAIN};
  color: ${colors.BLACK};
  font-weight: bold;
  ${presets.ELLIPSIS};
`;

export const ShipmentBLStyle: string = css`
  ${fontSizesWithHeights.SMALL};
  color: ${colors.BLACK};
  ${presets.ELLIPSIS};
`;

export const ShipmentRightWrapperStyle: string = css`
  ${layout.GRID_VERTICAL};
  grid-gap: 5px;
  width: 540px;
`;

export const ShipmentHeaderWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  justify-content: end;
  grid-gap: 5px;
  padding: 0 20px 0 0;
`;

export const ShipmentTagsWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  justify-content: end;
  grid-gap: 5px;
  overflow: hidden;
  height: 18px;
  width: 365px;
`;

export const ShipmentImporterWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  background-color: ${colors.GRAY_SUPER_LIGHT};
  padding: 0 5px;
  width: 150px;
  ${borderRadiuses.MAIN};
  grid-gap: 5px;
`;

export const ShipmentImporterIconStyle: string = css`
  color: ${colors.GRAY_DARK};
  ${fontSizes.SMALL};
`;

export const ShipmentImporterStyle: string = css`
  color: ${colors.BLACK};
  ${presets.ELLIPSIS};
  ${fontSizes.SMALL};
  width: 120px;
`;

export const ShipmentDataWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  justify-content: end;
  grid-gap: 10px;
  height: 20px;
`;

export const ShipmentInChargeWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 5px;
  height: 20px;
`;

export const ShipmentBadgeWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
`;

export const ShipmentBadgeIconStyle: string = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  ${fontSizes.SMALL};
  color: ${colors.GRAY_LIGHT};
`;

export const ShipmentBadgeStyle: string = css`
  ${fontSizes.SMALL};
  color: ${colors.GRAY_DARK};
  ${presets.ELLIPSIS};
  ${borderRadiuses.BUTTON};
  background-color: ${colors.GRAY_SUPER_LIGHT};
  padding: 0 10px;
  line-height: 20px;
`;

export const DividerStyle: string = css`
  height: 1px;
  background-color: ${colors.GRAY_VERY_LIGHT};
  width: 840px;
  margin: 0 20px;
`;
