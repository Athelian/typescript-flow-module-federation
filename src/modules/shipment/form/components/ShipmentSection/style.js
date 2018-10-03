// @flow
import { css } from 'react-emotion';
import { presets, layout, colors, borderRadiuses, fontSizes } from 'styles/common';

export const ShipmentSectionWrapperStyle: string = css`
  ${presets.BOX};
  width: 880px;
  padding: 40px 100px;
`;

export const MainFieldsWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  justify-content: space-between;
`;

export const ExporterLabelStyle: string = css`
  display: flex;
`;

export const ExporterSeeMoreButtonStyle: string = css`
  ${presets.BUTTON};
  color: ${colors.GRAY_LIGHT};
  width: 20px;
  flex-shrink: 0;
  ${fontSizes.SMALL};
  &:hover,
  :focus {
    color: ${colors.BLUE};
  }
`;

export const ExporterEmptyCardStyle: string = css`
  ${borderRadiuses.MAIN};
  background-color: ${colors.GRAY_SUPER_LIGHT};
  width: 195px;
  height: 215px;
`;

export const TagsInputStyle: string = css`
  margin-top: 20px;
`;

export const QuantitySummaryStyle: string = css`
  display: flex;
  justify-content: space-between;
`;

export const DividerStyle: string = css`
  margin: 40px 0;
  height: 1px;
  background-color: ${colors.GRAY_VERY_LIGHT};
  width: 100%;
`;
