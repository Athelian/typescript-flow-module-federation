// @flow
import { css } from 'react-emotion';
import { presets, layout, fontSizesWithHeights, colors } from 'styles/common';

export const OrderSectionWrapperStyle: string = css`
  ${presets.BOX};
  width: 880px;
  padding: 40px 100px;
`;

export const MainFieldsWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  justify-content: space-between;
`;

export const ExporterSectionStyle: string = css`
  ${layout.GRID_VERTICAL};
  grid-gap: 10px;
`;

export const ExporterCardStyle: string = css`
  width: 200px;
  height: 230px;
`;

export const ExporterCardImageStyle: string = css`
  border-radius: 5px 5px 0 0;
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

export const ExporterNameStyle: string = css`
  color: ${colors.BLACK};
  font-weight: bold;
  ${fontSizesWithHeights.MAIN};
  ${presets.ELLIPSIS};
  text-align: center;
  width: 200px;
  padding: 0 10px;
`;

export const TagsInputStyle: string = css`
  margin-top: 20px;
`;

export const QuantitySummaryStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 100px;
  grid-template-columns: repeat(2, 1fr);
`;

export const DividerStyle: string = css`
  margin: 40px 0;
  width: 100%;
  height: 1px;
  background-color: ${colors.GRAY_VERY_LIGHT};
`;
