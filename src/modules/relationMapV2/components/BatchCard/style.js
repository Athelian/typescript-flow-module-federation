// @flow
import { css } from 'react-emotion';
import { layout, borderRadiuses, fontSizes, colors, presets, shadows } from 'styles/common';

export const BatchCardWrapperStyle = css`
  display: flex;
  flex-direction: column;
  width: 445px;
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
  grid-template-columns: 125px 285px;
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
  grid-template-columns: 415px 20px;
  grid-template-rows: 20px;
  grid-gap: 5px;
  padding: 0 0 5px 5px;
`;

export const QuantityVolumeDesiredWrapperStyle: string = css`
  display: flex;
`;

export const DeleteBatchButtonStyle = css`
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
  &:hover {
    opacity: 1;
    ${shadows.INPUT};
    color: ${colors.RED};
  }
`;
