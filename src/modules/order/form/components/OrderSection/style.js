// @flow
import { css } from 'react-emotion';
import { presets, layout, colors } from 'styles/common';

export const OrderSectionWrapperStyle: string = css`
  ${presets.BOX};
  width: 880px;
  padding: 40px 100px;
  ${layout.GRID_VERTICAL};
  grid-gap: 20px;
`;

export const MainFieldsWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  justify-content: space-between;
`;

export const QuantitySummaryStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 100px;
  grid-template-columns: repeat(2, 1fr);
`;

export const DividerStyle: string = css`
  margin: 20px 0;
  width: 100%;
  height: 1px;
  background-color: ${colors.GRAY_VERY_LIGHT};
`;
