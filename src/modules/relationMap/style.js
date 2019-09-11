// @flow
import styled, { css } from 'react-emotion';
import {
  colors,
  presets,
  layout,
  fontSizes,
  borderRadiuses,
  scrollbars,
  shadows,
} from 'styles/common';

const getBorderColor = (isFocused: boolean) => (isFocused ? colors.TEAL : colors.GRAY_VERY_LIGHT);

export const ResetContentWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

export const OrderFocusGridWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 320px 320px 360px minmax(920px, 1fr);
  grid-template-rows: 50px 1fr;
  width: 100%;
  overflow-y: hidden;
  overflow-x: auto;
  flex: 1;
  ${scrollbars.MAIN};
`;

export const OrderFocusEntityHeaderWrapperStyle: string = css`
  grid-column: span 4;
  display: grid;
  grid-template-columns: 320px 320px 360px minmax(920px, 1fr);
  background-color: ${colors.WHITE};
  ${shadows.HEADER};
  z-index: 2;
`;

export const AllShipmentsToggleWrapperStyle = css`
  ${layout.GRID_HORIZONTAL};
  color: ${colors.GRAY_DARK};
  align-items: center;
`;

export const AllShipmentsIconStyle = css`
  color: ${colors.GRAY_LIGHT};
  ${fontSizes.SMALL};
  margin: 0 5px 0 0;
`;

export const InfiniteScrollWrapperStyle = (spacing: number = 0) => css`
  grid-column: span 3;
  overflow: auto;
  height: calc(100vh - 80px - ${spacing}px);
`;

export const OrderFocusedShipmentScrollWrapperStyle = css`
  overflow-x: hidden;
  overflow-y: auto;
  background-color: ${colors.ALMOST_WHITE};
  padding: 20px 10px;
  ${scrollbars.MAIN};
`;

export const BaseCardWrapperStyle = (isFocused: boolean) => css`
  box-shadow: none !important;
  border: 5px solid ${getBorderColor(isFocused)};
`;

export const GridWrapper = styled('div')`
  ${presets.BOX};
  width: 100%;
  display: grid;
  grid-template-columns: 66% 34%;
  background-color: ${colors.WHITE};
`;

export const RelationMapWrapperStyle = css`
  width: 100%;
  padding: 50px 20px;
  position: relative;
  display: flex;
  flex-direction: column;
`;

export const SummaryBadgesStyle = css`
  display: grid;
  grid-template-columns:
    minmax(max-content, 0.22fr) minmax(max-content, 0.22fr) minmax(max-content, 0.22fr)
    minmax(max-content, 0.34fr);
  width: 100%;
  height: 30px;
  align-items: center;
  z-index: 2;
`;

export const FunctionsWrapperStyle = css`
  display: grid;
  //grid-template-columns: minmax(max-content, 280px) minmax(max-content, 280px) minmax(max-content, 280px) minmax(max-content, 280px);
  grid-template-columns: minmax(280px, 1fr) minmax(280px, 1fr) minmax(280px, 1fr);
  padding-left: inherit;
  padding-right: inherit;
  width: 100%;
  height: 50px;
  align-items: center;
  background: #fff;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  z-index: 2;
`;

export const FunctionGroupWrapperStyle = css`
  ${layout.HORIZONTAL};
`;

const GridColumn = css`
  grid-template-columns: 1fr 1fr 1fr 1.8fr;
`;

export const ContentWrapperStyle = css`
  height: calc(100vh - 50px);
  padding: 0 0;
  width: 100%;
  overflow-y: hidden;
  z-index: 0;
`;

export const RelationMapGridStyle = css`
  display: grid;
  ${GridColumn};
`;

export const RelationMapGrid = styled('div')`
  /* width: 100%; */
  display: grid;
  ${GridColumn};
`;

export const ProductWrapper = css``;

export const EmptyMessageStyle = css`
  ${fontSizes.MAIN};
  font-weight: bold;
  color: ${colors.BLACK};
`;

export const ScrollWrapperStyle = css`
  height: calc(100vh - 220px);
  overflow-y: auto;
  background-color: ${colors.ALMOST_WHITE};
  padding: 10px 10px;
`;

export const ShipmentScrollWrapperStyle = css`
  height: calc(100vh - 150px);
  overflow-y: hidden;
  background-color: ${colors.ALMOST_WHITE};
  padding: 20px 10px;
`;
export const LeftScrollWrapperStyle = css`
  background-color: ${colors.ALMOST_WHITE};
  padding: 0 10px;
  height: 65vh;
  overflow-y: auto;
`;

export const ShipmentMapWrapperStyle = css`
  padding: 35px 10px;
  grid-column: span 3;
  display: grid;
  grid-template-columns: 0.9fr 0.1fr 0.9fr 0.1fr 1.8fr;
  grid-template-rows: repeat(auto-fill, 55px);
  grid-row-gap: 30px;
  background-color: ${colors.WHITE};
`;

export const OrderMapWrapperStyle = css`
  grid-column: span 3;
  display: grid;
  grid-template-columns: 0.9fr 0.1fr 0.9fr 0.1fr 0.9fr;
  background-color: ${colors.WHITE};
  padding: 15px 10px;
`;

export const FunctionWrapperStyle = css`
  grid-column: span 4;
  display: flex;
  background-color: ${colors.WHITE};
  padding: 0 10px;
  align-items: center;
  ${borderRadiuses.MAIN};
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  box-shadow: 0 5px 30px 0 rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 2;
`;

export const ProductFunctionWrapperStyle = css`
  ${FunctionWrapperStyle}
  padding: 5px 10px;
`;

export const BadgeWrapperStyle = css`
  grid-column: span 4;
  padding: 10px 0;
  display: grid;
  grid-template-columns: 0.97fr 0.95fr 1.05fr 1.8fr;
  background-color: ${colors.WHITE};
  -webkit-border-radius: 0;
  -moz-border-radius: 0;
  border-radius: 0;
  box-shadow: 0 5px 30px 0 rgba(0, 0, 0, 0.1);
  z-index: 1;
`;
export const FullGridWrapperStyle = css`
  grid-column: span 4;
`;
export const LoadingWrapperStyle = css`
  grid-column: span 4;
  display: flex;
  justify-content: center;
`;

export const TagWrapperStyle = css`
  grid-column: span 4;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 5px;
`;
