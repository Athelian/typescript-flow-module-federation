// @flow
import { css } from 'react-emotion';
import { colors, presets, fontSizes } from 'styles/common';

type TimelinePortName = {
  color: string,
};

export const TimelinePortNameWrapperStyle = ({ color }: TimelinePortName) => css`
  border-radius: 999px;
  // border: 1px solid ${colors[color]};
  height: 13px;
  line-height: 13px;
  width: 80px;
  text-align: center;
  ${presets.ELLIPSIS};
  ${fontSizes.TINY};
  color: ${colors.BLACK};
  font-weight: bold;
  user-select: none;
  z-index: 0;
  background-color: ${colors.GRAY_SUPER_LIGHT};
`;

export default TimelinePortNameWrapperStyle;
