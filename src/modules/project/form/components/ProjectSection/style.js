// @flow
import { css } from 'react-emotion';
import {
  layout,
  presets,
  colors,
  transitions,
  shadows,
  fontSizes,
  scrollbars,
} from 'styles/common';

export const ProjectSectionWrapperStyle = (isExpanded: boolean) => css`
  display: flex;
  height: ${isExpanded ? '340px' : '0px'};
  overflow: hidden;
  width: 100%;
  max-width: 100%;
  ${transitions.EXPAND};
`;

export const MainSectionWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  width: calc(100% - 220px);
`;

export const ProjectInfoWrapperStyle: string = css`
  ${layout.GRID_VERTICAL};
  grid-gap: 20px;
  position: relative;
  background-color: ${colors.WHITE};
  ${shadows.HEADER};
  padding: 20px;
  min-width: 680px;
  height: 240px;
  overflow: overlay;
  ${scrollbars.SMALL};
`;

export const DescriptionTagsWrapperStyle: string = css`
  display: flex;
  width: 100%;
`;

export const DescriptionWrapperStyle: string = css`
  width: 300px;
  padding-bottom: 20px;
`;

export const TagsWrapperStyle: string = css`
  ${layout.GRID_VERTICAL};
  grid-gap: 5px;
  padding: 0 0 10px 0;
  grid-template-columns: 420px;
`;

export const SharedPartnerWrapperStyle: string = css`
  padding: 0 20px 20px 0;
`;

export const MilestonesTimelineWrapperStyle: string = css`
  background-color: ${colors.WHITE};
`;

export const TasksInfoWrapperStyle: string = css`
  position: relative;
  background-color: ${colors.WHITE};
  ${shadows.HEADER_LEFT};
  padding: 25px 15px 20px 20px;
  width: 220px;
  flex-shrink: 0;
`;

export const ExpandWrapperStyle = css`
  position: relative;
  ${presets.BUTTON};
  background-color: ${colors.GRAY};
  color: ${colors.WHITE};
  height: 20px;
  width: 100%;
  ${shadows.HEADER};
  ${fontSizes.SMALL};
  z-index: 3;
  &:hover,
  :focus {
    background-color: ${colors.GRAY_DARK};
  }
`;

export const ProjectCardBodyStyle = (numOfColumns: number): string => css`
  display: grid;
  grid-template-columns: repeat(${numOfColumns}, minmax(143.75px, 1fr)) 35px;
  width: 100%;
  height: 100%;
  overflow-y: hidden;
  overflow-x: overlay;
  padding: 10px 0 10px 20px;
  ${scrollbars.SMALL};
  &::after {
    content: '';
    display: block;
    width: 35px;
    height: 100%;
  }
`;
