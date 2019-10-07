// @flow
import { css } from 'react-emotion';
import { layout, borderRadiuses, colors, fontSizes } from 'styles/common';

export const ShipmentSummaryWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
`;

export const SummaryStyle: string = css`
  display: grid;
  grid-template-columns: 350px 300px;
  grid-gap: 30px;
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

export const EditableCalculatedFieldsWrapperStyle: string = css`
  ${layout.GRID_VERTICAL};
  grid-gap: 20px;
  width: 350px;
  padding: 20px 0 0 0;
`;
