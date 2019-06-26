// @flow
import { css } from 'react-emotion';
import { fontSizes, layout, colors, borderRadiuses, transitions } from 'styles/common';

export const ContainerStyle: string = css`
  ${layout.VERTICAL};
  align-items: center;
  width: 100%;
`;

export const ProgressContainerStyle: string = css`
  position: relative;
  background-color: ${colors.GRAY_VERY_LIGHT};
  ${borderRadiuses.BUTTON};
  height: 16px;
  width: 100%;
  overflow: hidden;
`;

export const ProgressStyle = (width: number): string => css`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: ${width}px;
  background-color: ${colors.TEAL};
  ${transitions.MAIN};
`;

export const ProgressValueStyle = (width: number): string => css`
  position: absolute;
  top: 0;
  bottom: 0;
  left: ${Math.max(5, width - 25)}px;
  ${fontSizes.SMALL};
  color: ${colors.WHITE};
`;

export const StatusStyle: string = css`
  ${fontSizes.MEDIUM};
  color: ${colors.GRAY_DARK};
  letter-spacing: 0.2em;
  padding: 0 0 10px 0;
`;

export const MessageStyle: string = css`
  ${fontSizes.TINY};
  color: ${colors.GRAY_DARK};
  min-height: 11px;
  padding: 5px 0;
`;
