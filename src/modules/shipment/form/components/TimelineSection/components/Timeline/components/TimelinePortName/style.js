// @flow
import { css } from 'react-emotion';
import { colors, presets, fontSizes } from 'styles/common';

export const TimelinePortNameWrapperStyle: string = css`
  text-align: left;
  border-radius: 0 999px 999px 0;
  height: 30px;
  line-height: 30px;
  width: 165px;
  ${presets.ELLIPSIS};
  ${fontSizes.MAIN};
  background-color: ${colors.GRAY_SUPER_LIGHT};
  color: ${colors.BLACK};
  font-weight: bold;
  padding: 0 10px 0 20px;
  user-select: none;
  transform: translateX(-15px);
  z-index: 0;
`;

export default TimelinePortNameWrapperStyle;
