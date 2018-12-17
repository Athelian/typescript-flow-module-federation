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
  padding: 5px 30px 5px 10px;
`;

export const ShipmentLeftWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  flex: 1;
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
  flex: 1;
`;

export const ShipmentTagsWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  justify-content: end;
  grid-gap: 5px;
  overflow: hidden;
  height: 18px;
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
