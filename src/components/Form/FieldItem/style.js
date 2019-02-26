// @flow
import { css } from 'react-emotion';
import { layout } from 'styles/common';

export const FieldItemWrapperStyle = (vertical: boolean, verticalGap: string): string => css`
  position: relative;
  display: flex;
  ${vertical
    ? `
    ${layout.GRID_VERTICAL};
    grid-gap: ${verticalGap};
  `
    : `
    display: flex;
    align-items: center;
    justify-content: space-between;
  `};
  width: 100%;
`;

export const TooltipAbsoluteWrapperStyle: string = css`
  position: absolute;
  left: -20px;
  height: 20px;
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
