// @flow
import { css } from 'react-emotion';
import { presets, layout, colors, borderRadiuses } from 'styles/common';

export const SectionWrapperStyle: string = css`
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

export const AssignedAndApprovalWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 10px;
  background-color: ${colors.GRAY_SUPER_LIGHT};
  ${borderRadiuses.MAIN};
  padding: 5px 0 10px 0;
`;
