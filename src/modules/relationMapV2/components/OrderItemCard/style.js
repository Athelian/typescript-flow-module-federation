// @flow
import { css } from 'react-emotion';
import { ORDER_ITEM_WIDTH } from 'modules/relationMapV2/constants';
import { layout, borderRadiuses, fontSizes, colors, presets, shadows } from 'styles/common';

export const ItemCardWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  width: ${ORDER_ITEM_WIDTH}px;
  height: 55px;
  position: relative;
  &:hover {
    & button {
      opacity: 1;
    }
  }
`;

export const TopRowWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 150px 280px;
  grid-template-rows: 20px;
  grid-gap: 5px;
  padding: 5px;
`;

export const TagsAndDeliveryWrapperStyle: string = css`
  display: flex;
`;

export const TagsWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  ${borderRadiuses.MAIN};
  grid-gap: 5px;
  overflow: hidden;
  flex: 1;
`;

export const BottomRowWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 20px 150px 100px 150px 20px;
  grid-template-rows: 20px;
  grid-gap: 5px;
  padding: 0 0 5px 5px;
`;

export const ProductImageStyle: string = css`
  width: 20px;
  height: 20px;
  ${borderRadiuses.MAIN};
  object-fit: cover;
`;

export const ProductSerialStyle: string = css`
  ${fontSizes.SMALL};
  ${colors.BLACK};
  ${presets.ELLIPSIS};
  width: 100%;
  line-height: 20px;
`;

export const DeleteItemButtonStyle: string = css`
  opacity: 0;
  position: absolute;
  top: -10px;
  right: -10px;
  ${presets.BUTTON};
  width: 20px;
  height: 20px;
  background-color: ${colors.WHITE};
  color: ${colors.GRAY_LIGHT};
  ${fontSizes.SMALL};
  ${borderRadiuses.CIRCLE};
  z-index: 2;
  ${shadows.INPUT};
  &:hover {
    opacity: 1;
    color: ${colors.RED};
  }
`;

export const CreateBatchButtonStyle: string = css`
  opacity: 0;
  position: absolute;
  bottom: -10px;
  left: calc(100% - 10px);
  ${presets.BUTTON};
  width: 20px;
  height: 20px;
  background-color: ${colors.BATCH};
  color: ${colors.WHITE};
  ${fontSizes.SMALL};
  ${borderRadiuses.BUTTON};
  z-index: 2;
  justify-content: flex-start;
  overflow: hidden;
  ${shadows.INPUT};
  &:hover {
    opacity: 1;
    width: 45px;
  }
`;

export const CreateBatchIconStyle: string = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
`;
