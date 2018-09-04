// @flow
import { css } from 'react-emotion';
import { presets, layout, fontSizesWithHeights, colors } from 'styles/common';

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

export const ItemCardStyle = css`
  width: 200px;
  height: 230px;
`;

export const ItemCardImageStyle = css`
  border-radius: 5px 5px 0 0;
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

export const ItemNameStyle = css`
  color: ${colors.BLACK};
  font-weight: bold;
  ${fontSizesWithHeights.MAIN};
  ${presets.ELLIPSIS};
  text-align: center;
  width: 200px;
  padding: 0 10px;
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
`;
