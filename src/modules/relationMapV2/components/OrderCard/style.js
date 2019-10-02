// @flow
import { css } from 'react-emotion';
import { ORDER_WIDTH } from 'modules/relationMapV2/constants';
import { layout, borderRadiuses, presets, colors, shadows, fontSizes } from 'styles/common';

export const OrderCardWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  width: ${ORDER_WIDTH}px;
  height: 55px;
  position: relative;
  &:hover {
    & > button {
      opacity: 1;
    }
  }
`;

export const TopRowWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 125px 125px;
  grid-template-rows: 20px;
  grid-gap: 5px;
  padding: 5px;
`;

export const TagsWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  ${borderRadiuses.MAIN};
  grid-gap: 5px;
  overflow: hidden;
`;

export const BottomRowWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 125px 125px 20px;
  grid-template-rows: 20px;
  grid-gap: 5px;
  padding: 0 0 5px 5px;
`;

export const CreateItemButtonStyle: string = css`
  opacity: 0;
  position: absolute;
  bottom: -10px;
  left: calc(100% - 10px);
  ${presets.BUTTON};
  width: 20px;
  height: 20px;
  background-color: ${colors.ORDER_ITEM};
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

export const CreateItemIconStyle: string = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
`;
