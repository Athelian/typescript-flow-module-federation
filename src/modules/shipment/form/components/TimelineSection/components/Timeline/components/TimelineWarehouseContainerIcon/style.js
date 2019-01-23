// @flow
import { css } from 'react-emotion';
import { borderRadiuses, presets, colors, shadows, fontSizes } from 'styles/common';

const BORDER_WRAPPER = 4;
const BORDER = BORDER_WRAPPER / 2;

export const TimelineIconStyle: string = css`
  position: relative;
  ${presets.BUTTON};
  ${borderRadiuses.CIRCLE};
  background-color: ${colors.WHITE};
  color: ${colors.GRAY_LIGHT};
  ${fontSizes.MAIN};
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  z-index: 1;
  border: ${BORDER_WRAPPER}px solid ${colors.GRAY_LIGHT};
  &:hover,
  :focus {
    ${shadows.INPUT};
  }
`;

export const IconWrapperStyle = (color: string) => css`
  color: ${colors[color]};
`;

export const TimelineRingWrapperStyle = (percent: number, size: number) => css`
  position: absolute;
  width: ${size}px;
  height: ${size}px;
  clip: ${percent > 50
    ? 'rect(auto, auto, auto, auto)'
    : `rect(0em, ${size}px, ${size}px, ${size / 2}px)`};
`;

export const TimelineRingStyle = ({ size, color }: { size: number, color: string }) => css`
  ${borderRadiuses.CIRCLE};
  position: absolute;
  border: ${BORDER}px solid ${colors[color]};
  width: ${size}px;
  height: ${size}px;
  clip: rect(0px, ${size / 2}px, ${size}px, 0px);
`;

export const TimelineBarStyle = ({
  percent,
  size,
  color,
}: {
  percent: number,
  size: number,
  color: string,
}) => css`
  ${TimelineRingStyle({ size, color })}
  transform: rotate(${(360 / 100) * percent}deg);
`;

export const TimelineFillStyle = ({
  percent,
  size,
  color,
}: {
  percent: number,
  size: number,
  color: string,
}) => css`
  ${TimelineRingStyle({ size, color })}
  ${percent > 50 ? 'transform: rotate(180deg)' : ''};
`;
