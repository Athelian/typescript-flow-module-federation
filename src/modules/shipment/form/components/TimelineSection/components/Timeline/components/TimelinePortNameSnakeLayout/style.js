// @flow
import { css } from 'react-emotion';
import { colors, presets, fontSizes, borderRadiuses } from 'styles/common';

type TimelinePortNameWrapperType = {
  vertical: boolean,
  size: string,
};

export const TimelinePortNameWrapperStyle = ({
  vertical,
  size = 'MAIN',
}: TimelinePortNameWrapperType): string => css`
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

  ${size &&
    size === 'LITTLE' &&
    `
    width: 80px;
    height: 13px;
    line-height: 13px;
    font-size: 9px;
    font-weight: 500;
  `};
`;

export default TimelinePortNameWrapperStyle;
