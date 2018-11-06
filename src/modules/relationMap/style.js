// @flow
import styled, { css } from 'react-emotion';
import { colors, presets, layout, fontSizes, borderRadiuses } from 'styles/common';

const getBorderColor = (isFocused: boolean) => (isFocused ? colors.TEAL : colors.GRAY_QUITE_LIGHT);

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

export const InfiniteScrollWrapperStyle = (spacing: number = 0) => css`
  grid-column: span 3;
  overflow: auto;
  height: calc(100vh - 150px - ${spacing}px);
`;

export const ScrollWrapperStyle = css`
  height: calc(100vh - 220px);
  overflow-y: auto;
  background-color: ${colors.ALMOST_WHITE};
  padding: 10px 10px;
`;

export const OrderFocusedShipmentScrollWrapperStyle = css`
  height: calc(100vh - 220px);
  overflow-y: auto;
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
  grid-template-columns: 0.9fr 0.1fr 0.9fr 0.1fr 1fr;
  background-color: ${colors.WHITE};
  padding: 15px 10px;
`;
export const FunctionWrapperStyle = css`
  grid-column: span 4;
  display: flex;
  //grid-template-columns: 1fr 3.8fr;
  background-color: ${colors.WHITE};
  padding: 10px 10px;
  ${borderRadiuses.MAIN};
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  box-shadow: 0 5px 30px 0 rgba(0, 0, 0, 0.1);
  z-index: 2;
  position: relative;
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
