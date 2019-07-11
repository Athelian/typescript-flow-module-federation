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
  height: 164px;
`;

export const ShipmentInfoWrapperStyle: string = css`
  display: flex;
  width: 100%;
  padding: 5px 10px;
`;

export const ShipmentLeftWrapperStyle: string = css`
  ${layout.GRID_VERTICAL};
  grid-gap: 5px;
  grid-template-columns: 210px;
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
  height: 20px;
  line-height: 20px;
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
  width: 630px;
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
  width: 300px;
`;

export const ShipmentImporterWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  background-color: ${colors.GRAY_SUPER_LIGHT};
  padding: 0 5px;
  width: 150px;
  ${borderRadiuses.MAIN};
  grid-gap: 5px;
  align-items: center;
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

export const ShipmentExporterWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  background-color: ${colors.GRAY_SUPER_LIGHT};
  padding: 0 5px;
  width: 150px;
  ${borderRadiuses.MAIN};
  grid-gap: 5px;
  align-items: center;
`;

export const ShipmentExporterIconStyle: string = css`
  color: ${colors.GRAY_DARK};
  ${fontSizes.SMALL};
`;

export const ShipmentExporterStyle: string = css`
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
  position: relative;
  height: 20px;
  width: 70px;
`;

export const InChargeStyle = (index: number): string => css`
  position: absolute;
  right: ${index > 0 ? index * 12 : 0}px;
  border: 1px solid ${colors.WHITE};
  width: 22px;
  height: 22px;
  ${borderRadiuses.CIRCLE};
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

export const ShipmentBadgeStyle = (width: string): string => css`
  ${fontSizes.SMALL};
  color: ${colors.GRAY_DARK};
  ${presets.ELLIPSIS};
  ${borderRadiuses.BUTTON};
  background-color: ${colors.GRAY_SUPER_LIGHT};
  padding: 0 5px;
  line-height: 20px;
  width: ${width};
  text-align: center;
`;

export const DividerStyle: string = css`
  height: 1px;
  background-color: ${colors.GRAY_VERY_LIGHT};
  width: 840px;
  margin: 0 20px;
`;

export const ContainerTypeTooltipTitleStyle: string = css`
  ${fontSizes.MAIN};
  border-bottom: 1px solid ${colors.WHITE};
  padding: 0 0 5px 0;
  margin: 0 0 5px 0;
  letter-spacing: 2px;
`;

export const ContainerTypeWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 70px minmax(50px, 1fr);
`;

export const ContainerTypeLabelStyle: string = css`
  ${presets.ELLIPSIS};
  ${fontSizes.MAIN};
  text-align: left;
`;

export const ContainerTypeCountStyle: string = css`
  text-align: center;
  font-weight: bold;
  ${fontSizes.MAIN};
`;
