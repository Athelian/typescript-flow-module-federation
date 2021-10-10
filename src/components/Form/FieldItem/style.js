// @flow
import { css } from 'react-emotion';
import { layout, colors } from 'styles/common';

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
    justify-content: space-between;
  `};
  width: 100%;
`;

export const LabelTooltipWrapperStyle: string = css`
  position: relative;
  height: min-content;
`;

export const SubLabelStyle = css`
  color: ${colors.GRAY_DARK};
  margin-left: 4px;
  font-size: 12px;
`;

export const TooltipAbsoluteWrapperStyle: string = css`
  position: absolute;
  left: -20px;
  height: 100%;
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
