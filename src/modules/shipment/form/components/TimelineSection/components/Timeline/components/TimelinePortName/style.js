// @flow
import { css } from 'react-emotion';
import { colors, borderRadiuses, presets, fontSizes } from 'styles/common';

export const TimelinePortNameWrapperStyle = css`
  border: 2px solid ${colors.GRAY_LIGHT};
  text-align: center;
  ${borderRadiuses.BUTTON};
  height: 30px;
  line-height: 26px;
  width: 150px;
  ${presets.ELLIPSIS};
  ${fontSizes.MAIN};
  font-weight: bold;
  color: ${colors.GRAY_DARK};
  padding: 0 10px;
  user-select: none;
`;

export default TimelinePortNameWrapperStyle;
