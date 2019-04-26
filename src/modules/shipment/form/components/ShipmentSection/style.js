// @flow
import { css } from 'react-emotion';
import { presets, layout, colors, fontSizes } from 'styles/common';

export const ShipmentSectionWrapperStyle: string = css`
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

export const BookedStyle = (booked: boolean) => css`
  color: ${booked ? colors.TEAL : colors.GRAY_LIGHT};
`;
