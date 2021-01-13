// @flow
import { css } from 'react-emotion';
import { colors, presets, fontSizes, scrollbars, layout, borderRadiuses } from 'styles/common';

export const ProjectCardStyle: string = css`
  display: flex;
  flex-direction: column;
  width: 645px;
  height: 216px;
`;

export const ProjectCardHeaderStyle: string = css`
  width: 100%;
  display: flex;
  padding: 10px 25px 5px 13px;
  align-items: center;
`;

export const ProjectCardSubHeaderStyle: string = css`
  width: 100%;
  display: flex;
  padding: 0px 25px 5px 13px;
  align-items: center;
`;

export const OwnerWrapperStyle: string = css`
  width: 100%;
  display: flex;
  padding: 2px 8px 2px 4px;
  ${fontSizes.MAIN};
  ${borderRadiuses.MAIN};
  text-align: center;
  background-color: ${colors.GRAY_SUPER_LIGHT};
`;

export const OwnerTextStyle: string = css`
  ${presets.ELLIPSIS};
  font-weight: bold;
  max-width: 200px;
  color: ${colors.BLACK};
`;

export const ProjectDueDateStyle: string = css`
  display: flex;
  width: 165px;
`;

export const DiffDateStyle = (diff: number): string => css`
  color: ${diff > 0 ? colors.RED : colors.TEAL};
  ${fontSizes.SMALL};
  width: 25px;
  height: 20px;
  font-weight: bold;
  line-height: 20px;
  text-align: center;
`;

export const InfoIconStyle: string = css`
  color: ${colors.GRAY_LIGHT};
  ${fontSizes.SMALL};
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const TagsWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 5px;
  overflow: hidden;
  height: 20px;
  align-items: center;
  width: min-content;
  max-width: 250px;
  ${borderRadiuses.MAIN};
  margin-left: auto;
`;

export const DividerStyle: string = css`
  width: 625px;
  height: 1px;
  background-color: ${colors.GRAY_SUPER_LIGHT};
  margin: 0 10px;
`;

export const ProjectCardBodyStyle = (numOfMilestones: number): string => css`
  display: grid;
  grid-auto-columns: minmax(143.75px, 1fr);
  grid-auto-flow: column;
  width: 100%;
  height: 100%;
  overflow-y: hidden;
  overflow-x: overlay;
  padding: 10px 35px;
  ${scrollbars.SMALL};
  ${numOfMilestones > 4 &&
    `
    &::after {
      content: "";
      display: block;
      width: 35px;
      height: 100%;
    }
  `};
`;

export const ToolTipDiffDateStyle = (color: string): string => {
  return css`
    color: ${color};
    background-color: ${colors.WHITE};
    height: 20px;
    ${presets.ELLIPSIS};
    ${borderRadiuses.BUTTON};
  `;
};

export const TooltipGridStyle: string = css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 5px;
  color: ${colors.WHITE};
`;
