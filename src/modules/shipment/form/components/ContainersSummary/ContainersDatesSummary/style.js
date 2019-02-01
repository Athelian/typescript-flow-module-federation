// @flow
import { css } from 'react-emotion';
import { layout } from 'styles/common';

export const ContainerDatesSummaryStyle: string = css`
  position: relative;
  display: flex;
  flex: 1;
  align-items: flex-end;
  width: 100%;
`;

export const ColumnWrapperStyle: string = css`
  ${layout.GRID_VERTICAL};
  grid-gap: 10px;
  flex: 1;
`;
