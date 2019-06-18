// @flow
import { css } from 'react-emotion';

import { layout } from 'styles/common';

export const ProjectCardStyle: string = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 195px;
  height: 214px;
`;

export const CommonCardGridStyle: string = css`
  display: grid;
  grid-template-columns: 185px;
  grid-gap: 5px;
  padding: 5px 5px 10px 5px;
`;

export const ProjectNameStyle: string = css`
  width: 100%;
  padding: 0 15px 0 0;
`;

export const TaskStatusChartStyle: string = css`
  padding: 0 5px;
`;

export const TagsWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 5px;
  overflow: hidden;
  width: 100%;
  padding: 0 5px;
`;
