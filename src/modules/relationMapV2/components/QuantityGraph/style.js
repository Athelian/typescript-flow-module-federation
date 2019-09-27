// @flow
import { css } from 'react-emotion';
import { fontSizes, colors, presets, borderRadiuses } from 'styles/common';

export const QuantityGraphWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 20px;
`;

export const NumbersWrapperStyle: string = css`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 5px;
`;

export const NumberStyle = (color: string, align: string): string => css`
  color: ${colors[color]};
  ${fontSizes.SMALL};
  ${presets.ELLIPSIS};
  text-align: ${align};
  font-weight: bold;
  height: 12px;
  line-height: 12px;
`;

export const GraphWrapperStyle: string = css`
  margin: 2px 0 0 0;
  height: 6px;
  ${borderRadiuses.BUTTON};
`;

export const ProgressBarBackgroundStyle: string = css`
  width: 100%;
  height: 100%;
  position: relative;
  background-color: rgba(0, 0, 0, 0.1);
  ${borderRadiuses.BUTTON};
  opacity: 0.5;
`;

export const ProgressBarStyle = (color: string, percent: number): string => css`
  position: absolute;
  left: 0;
  top: 0;
  background-color: ${colors[color]};
  ${borderRadiuses.BUTTON};
  height: 100%;
  width: ${percent > 1 ? 100 : percent * 100}%;
  min-width: ${percent > 0 ? '6px' : '0px'};
`;
