// @flow
import { css } from 'react-emotion';
import { colors, fontSizesWithHeights, presets, layout } from 'styles/common';

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
  padding: 5px 30px 0 10px;
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
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const ShipmentTagsWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  justify-content: end;
  grid-gap: 5px;
  overflow: hidden;
`;

export const DividerStyle: string = css`
  height: 1px;
  background-color: ${colors.GRAY_VERY_LIGHT};
  width: 840px;
  margin: 0 20px;
`;
