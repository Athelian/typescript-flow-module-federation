// @flow
import { css } from 'react-emotion';
import { ORDER_WIDTH } from 'modules/relationMapV2/constants';
import { layout, borderRadiuses } from 'styles/common';

export const OrderCardWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  width: ${ORDER_WIDTH}px;
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
