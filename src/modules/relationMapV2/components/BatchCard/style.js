// @flow
import { css } from 'react-emotion';
import { BATCH_WIDTH } from 'modules/relationMapV2/constants';
import { layout, borderRadiuses, colors, fontSizes, presets } from 'styles/common';

export const BatchCardWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  width: ${BATCH_WIDTH}px;
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
  grid-template-columns: 100px 310px;
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

export const DelayStyle = (delayAmount: number, lineNumber: number): string => css`
  ${fontSizes.SMALL};
  ${presets.ELLIPSIS};
  position: absolute;
  right: 20px;
  top: ${(lineNumber - 1) * 25 + 5}px;
  color: ${delayAmount > 0 ? colors.RED : colors.TEAL};
  font-weight: bold;
  text-align: center;
`;
