// @flow
import { css } from 'react-emotion';
import { presets, layout, colors, borderRadiuses } from 'styles/common';

export const FreeTimeMessageStyle = (freeTime: number, approved: boolean) => {
  let color;

  if (approved) {
    color = colors.GRAY_LIGHT;
  } else if (freeTime > 7) {
    color = colors.TEAL;
  } else if (freeTime > 0) {
    color = colors.YELLOW;
  } else {
    color = colors.RED;
  }

  return css`
    color: ${color};
  `;
};

export const ContainerSectionWrapperStyle: string = css`
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

export const WarehouseSectionStyle: string = css`
  ${layout.GRID_VERTICAL};
  grid-gap: 10px;
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

export const SummaryStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 100px;
  grid-template-columns: repeat(2, 1fr);
`;
