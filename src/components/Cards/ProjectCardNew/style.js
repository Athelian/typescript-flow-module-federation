// @flow
import { css } from 'react-emotion';

import { colors, presets, fontSizes, scrollbars, layout, borderRadiuses } from 'styles/common';

export const InfoIconStyle: string = css`
  color: ${colors.GRAY_LIGHT};
`;

export const ProjectCardStyle: string = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 645px;
  height: 181px;
`;

export const ProjectCardHeaderStyle: string = css`
  width: 100%;
  display: flex;
  padding: 5px 35px 5px 5px;
  ${fontSizes.MAIN};
`;

export const ProjectNameStyle: string = css`
  width: 200px;
  color: ${colors.BLACK};
  ${presets.ELLIPSIS};
`;

export const ProjectDueDateStyle: string = css`
  display: grid;
  width: 170px;
  grid-template-columns: 30px 70px 20px 20px;
  grid-gap: 10px;
`;

export const TooltipGridStyle: string = css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 5px;
  color: ${colors.WHITE};
`;

export const ProjectCardBodyStyle: string = css`
  display: grid;
  grid-auto-columns: minmax(143.75px, 1fr);
  grid-auto-flow: column;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow-y: hidden;
  overflow-x: overlay;
  padding: 20px 27px 20px 20px;
  ${fontSizes.SMALL};
  ${scrollbars.SMALL};
`;

export const DiffDateStyle = (color: string): string => {
  return css`
    color: ${color};
  `;
};

export const ToolTipDiffDateStyle = (color: string): string => {
  return css`
    color: ${color};
    background-color: ${colors.WHITE};
    height: 20px;
    ${presets.ELLIPSIS};
    ${borderRadiuses.BUTTON};
  `;
};

export const TagsWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  justify-content: end;
  grid-gap: 5px;
  overflow: hidden;
  height: 18px;
  width: 300px;
`;
