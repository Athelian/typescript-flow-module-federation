// @flow
import { css } from 'react-emotion';
import { layout } from 'styles/common';

export const PackagingWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;
`;

export const LabelsWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 150px 150px 1fr;
  grid-gap: 20px;
  width: 100%;
  padding: 0 0 0 140px;
`;

export const MetricInputsBodyWrapperStyle: string = css`
  ${layout.GRID_VERTICAL};
  grid-gap: 20px;
  width: 100%;
`;

export const MetricInputsWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 120px 150px 150px 60px;
  grid-gap: 20px;
  width: 100%;
  align-items: center;
`;
