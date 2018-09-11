// @flow
import { css } from 'react-emotion';
import { presets, layout, colors, borderRadiuses, fontSizes } from 'styles/common';

export const ShipmentSectionWrapperStyle = css`
  ${presets.BOX};
  width: 880px;
  padding: 40px 100px;
`;

export const MainFieldsWrapperStyle = css`
  ${layout.GRID_HORIZONTAL};
  justify-content: space-between;
`;

export const ExporterLabelStyle = css`
  display: flex;
`;

export const ExporterSeeMoreButtonStyle = css`
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

export const ExporterEmptyCardStyle = css`
  ${borderRadiuses.MAIN};
  background-color: ${colors.GRAY_SUPER_LIGHT};
  width: 200px;
  height: 230px;
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
