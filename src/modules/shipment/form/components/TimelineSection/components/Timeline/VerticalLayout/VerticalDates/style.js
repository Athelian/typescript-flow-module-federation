// @flow
import { css } from 'react-emotion';

export const VerticalDatesWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 150px;
`;

export const SingularDateWrapperStyle: string = css`
  display: flex;
  align-items: center;
  height: 30px;
`;

export const VoyageDatesWrapperStyle: string = css`
  flex: 2;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const BlankGapStyle: string = css`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;
