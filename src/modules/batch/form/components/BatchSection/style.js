// @flow
import { css } from 'react-emotion';
import { presets, layout, colors } from 'styles/common';

export const BatchSectionWrapperStyle: string = css`
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

export const ItemSectionStyle: string = css`
  ${layout.GRID_VERTICAL};
  grid-gap: 10px;
`;

export const QuantitySummaryStyle: string = css`
  display: flex;
  justify-content: space-between;
`;

export const DividerStyle: string = css`
  margin: 20px 0;
  height: 1px;
  background-color: ${colors.GRAY_VERY_LIGHT};
  width: 100%;
`;
