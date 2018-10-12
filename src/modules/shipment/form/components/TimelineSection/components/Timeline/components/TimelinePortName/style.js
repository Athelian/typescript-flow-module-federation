// @flow
import { css } from 'react-emotion';
import { colors, presets, fontSizes, borderRadiuses } from 'styles/common';

export const TimelinePortNameWrapperStyle = (vertical: boolean): string => css`
  ${vertical
    ? `
    text-align: left;
    border-radius: 0 999px 999px 0;
    width: 165px;
    height: 30px;
    line-height: 30px;
    padding: 0 10px 0 20px;
    transform: translateX(-15px);
    ${fontSizes.MAIN};
  `
    : `
    text-align: center;
    ${borderRadiuses.BUTTON};
    width: 100px;
    height: 20px;
    line-height: 20px;
    padding: 0 10px;
    ${fontSizes.MEDIUM};
  `};
  ${presets.ELLIPSIS};
  background-color: ${colors.GRAY_SUPER_LIGHT};
  color: ${colors.BLACK};
  font-weight: bold;
  user-select: none;
  z-index: 0;
`;

export default TimelinePortNameWrapperStyle;
