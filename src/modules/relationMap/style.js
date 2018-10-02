// @flow
import styled, { css } from 'react-emotion';
import { colors, presets, layout, fontSizes } from 'styles/common';

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

export const ShipmentWrapperStyle = css`
  background-color: #f7f7f7;
  padding: 10px;
  display: grid;
  grid-row-gap: 20px;
`;

const GridColumn = css`
  grid-template-columns: 1fr 1fr 1fr 1.8fr;
`;

export const ContentWrapperStyle = css`
  width: 100%;
  padding: 50px 20px;
`;

export const RelationMapGrid = styled('div')`
  /* width: 100%; */
  display: grid;
  ${GridColumn};
`;

export const ProductWrapper = css`
  width: 85vw;
`;

export const EmptyMessageStyle = css`
  ${fontSizes.MAIN};
  font-weight: bold;
  color: ${colors.BLACK};
`;

export const InfiniteScrollWrapperStyle = (hasMore: boolean, height: number) => css`
  height: ${height}px;
  ${hasMore && `overflow: auto;`};
`;

export const ScrollWrapperStyle = css`
  background-color: #f7f7f7;
  padding: 10px;
`;

export const ShipmentMapWrapperStyle = css`
  grid-column: span 3;
  display: grid;
  grid-template-columns: 0.9fr 0.1fr 0.9fr 0.1fr 1.8fr;
  grid-template-rows: repeat(auto-fill, 55px);
  background-color: ${colors.WHITE};
`;

export const OrderMapWrapperStyle = css`
  grid-column: span 3;
  display: grid;
  grid-template-columns: 0.9fr 0.1fr 0.9fr 0.1fr 1fr;
  background-color: #ffffff;
  padding: 10px;
`;
export const FunctionWrapperStyle = css`
  grid-column: span 4;
  display: flex;
  justify-content: space-between;
  background-color: ${colors.WHITE};
  padding: 5px;
  ${presets.BOX};
`;

export const BadgeWrapperStyle = css`
  grid-column: span 4;
  padding-top: 10px;
  padding-bottom: 5px;
  display: grid;
  ${GridColumn};
  background-color: ${colors.WHITE};
  ${presets.BOX};
`;
export const LoadingWrapperStyle = css`
  grid-column: span 4;
  display: flex;
  justify-content: center;
`;

export const TagWrapperStyle = css`
  grid-column: span 4;
  justify-content: end;
`;
