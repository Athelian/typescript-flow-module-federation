// @flow
import { css } from 'react-emotion';
import { layout, presets, colors, transitions, shadows, fontSizes } from 'styles/common';

export const ProjectSectionWrapperStyle = (isExpanded: boolean) => css`
  display: grid;
  grid-template-columns: 1fr 220px 180px;
  height: ${isExpanded ? '360px' : '0px'};
  overflow: hidden;
  width: 100%;
  ${transitions.EXPAND};
`;

export const MainSectionWrapperStyle: string = css`
  display: flex:
  flex-direction: column;
`;

export const ProjectInfoWrapperStyle: string = css`
  ${layout.GRID_VERTICAL};
  grid-gap: 20px;
  position: relative;
  background-color: ${colors.WHITE};
  ${shadows.HEADER};
  padding: 20px;
  min-width: 680px;
`;

export const DescriptionTagsWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 420px 1fr;
  grid-gap: 20px;
  width: 100%;
`;

export const MilestonesTimelineWrapperStyle: string = css`
  background-color: ${colors.WHITE};
  padding: 20px;
`;

export const WarningColorStyle = (diffDay: number) => css`
  color: ${diffDay < 0 ? colors.RED : colors.GRAY_DARK};
`;

export const TasksInfoWrapperStyle: string = css`
  position: relative;
  background-color: ${colors.WHITE};
  ${shadows.HEADER_LEFT};
  padding: 25px 15px 20px 20px;
`;

export const BindedAndRelatedWrapperStyle: string = css`
  position: relative;
  background-color: ${colors.WHITE};
  ${shadows.HEADER_LEFT};
  padding: 25px 15px 20px 20px;
`;

export const ExpandWrapperStyle = css`
  ${presets.BUTTON};
  background-color: ${colors.GRAY};
  color: ${colors.WHITE};
  height: 20px;
  width: 100%;
  ${shadows.HEADER};
  ${fontSizes.SMALL};
  &:hover,
  :focus {
    background-color: ${colors.GRAY_DARK};
  }
`;
