// @flow
import { css } from 'react-emotion';
import { colors } from 'styles/common';

export const OrderCardWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 195px;
`;

export const OrderInfoWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 195px;
  grid-gap: 5px;
  padding: 5px 0;
`;

export const QuantityWrapperStyle: string = css`
  width: 100%;
  padding: 0 5px;
`;

export const UnitPriceWrapperStyle: string = css`
  position: relative;
  width: 100%;
  padding: 0 5px;
  &:hover {
    & > button {
      opacity: 1;
    }
  }
`;

export const DividerStyle: string = css`
  height: 1px;
  background-color: ${colors.GRAY_VERY_LIGHT};
  margin: 0 10px;
`;

export const ChartWrapperStyle: string = css`
  width: 195px;
  padding: 0 10px;
  margin: 3px 0;
`;
