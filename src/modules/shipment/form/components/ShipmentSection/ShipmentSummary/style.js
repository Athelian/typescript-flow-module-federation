// @flow
import { css } from 'react-emotion';
import { layout, borderRadiuses, colors, fontSizes } from 'styles/common';

export const SummaryStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 100px;
  grid-template-columns: repeat(2, 1fr);
`;

export const ContainerTypesWrapperStyle: string = css`
  ${borderRadiuses.MAIN};
  background-color: ${colors.GRAY_SUPER_LIGHT};
  ${layout.GRID_VERTICAL};
  grid-gap: 5px;
  margin: 5px 0 0 0;
  padding: 5px 0;
`;

export const TasksWrapperStyle: string = css`
  ${borderRadiuses.MAIN};
  ${layout.GRID_VERTICAL};
  grid-gap: 5px;
  margin: 5px 0 0 0;
  padding: 5px 0;
`;

export const TaskIconStyle = (color: string): string => css`
  display: flex;
  ${fontSizes.SMALL};
  color: ${colors[color]};
  height: 20px;
  width: 20px;
  align-items: center;
  justify-content: center;
`;
