// @flow
import { css } from 'react-emotion';
import { presets, layout, colors } from 'styles/common';

export const BatchSectionWrapperStyle = css`
  ${presets.BOX};
  width: 880px;
  padding: 40px 100px;
`;

export const MainFieldsWrapperStyle = css`
  ${layout.GRID_HORIZONTAL};
  justify-content: space-between;
`;

export const ItemSectionStyle = css`
  ${layout.GRID_VERTICAL};
  grid-gap: 10px;
`;

export const TagsInputStyle = css`
  margin-top: 20px;
`;

export const QuantitySummaryStyle = css`
  display: flex;
  justify-content: space-between;
`;

export const DividerStyle = css`
  margin: 40px 0;
  height: 1px;
  background-color: ${colors.GRAY_VERY_LIGHT};
  width: 100%;
`;
