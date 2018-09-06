// @flow
import { css } from 'react-emotion';
import { presets, layout, fontSizesWithHeights, colors } from 'styles/common';

export const OrderSectionWrapperStyle = css`
  ${presets.BOX};
  width: 880px;
  padding: 40px 100px;
`;

export const MainFieldsWrapperStyle = css`
  ${layout.GRID_HORIZONTAL};
  justify-content: space-between;
`;

export const ExporterSectionStyle = css`
  ${layout.GRID_VERTICAL};
  grid-gap: 10px;
`;

export const ExporterCardStyle = css`
  width: 200px;
  height: 230px;
`;

export const ExporterCardImageStyle = css`
  border-radius: 5px 5px 0 0;
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

export const ExporterNameStyle = css`
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
  ${layout.GRID_HORIZONTAL};
  grid-gap: 100px;
  grid-template-columns: repeat(2, 1fr);
`;

export const DividerStyle = css`
  margin: 40px 0;
`;
