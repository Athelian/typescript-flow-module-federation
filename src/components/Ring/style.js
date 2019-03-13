// @flow
import { css } from 'react-emotion';
import { borderRadiuses, colors } from 'styles/common';

const BORDER_WRAPPER = 4;
const BORDER = BORDER_WRAPPER / 2;

export const RingWrapperStyle = (percent: number, size: number) => css`
  position: absolute;
  width: ${size}px;
  height: ${size}px;
  clip: ${percent > 50
    ? 'rect(auto, auto, auto, auto)'
    : `rect(0em, ${size}px, ${size}px, ${size / 2}px)`};
`;

export const RingStyle = ({ size, color }: { size: number, color: string }) => css`
  ${borderRadiuses.CIRCLE};
  position: absolute;
  border: ${BORDER}px solid ${colors[color]};
  width: ${size}px;
  height: ${size}px;
  clip: rect(0px, ${size / 2}px, ${size}px, 0px);
`;

export const BarStyle = ({
  percent,
  size,
  color,
}: {
  percent: number,
  size: number,
  color: string,
}) => css`
  ${RingStyle({ size, color })}
  transform: rotate(${(360 / 100) * percent}deg);
`;

export const FillStyle = ({
  percent,
  size,
  color,
}: {
  percent: number,
  size: number,
  color: string,
}) => css`
  ${RingStyle({ size, color })}
  ${percent > 50 ? 'transform: rotate(180deg)' : ''};
`;
