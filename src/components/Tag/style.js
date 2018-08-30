// @flow
import { css } from 'react-emotion';
import {
  presets,
  layout,
  colors,
  fontSizes,
  borderRadiuses,
  fontSizesWithHeights,
} from 'styles/common';

export const computeTextColor = (color: string) => {
  const hex = color.replace(
    /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
    (m, r, g, b) => r + r + g + g + b + b
  );

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    return colors.BLACK;
  }

  const red = parseInt(result[1], 16);
  const green = parseInt(result[2], 16);
  const blue = parseInt(result[3], 16);

  return red * 0.299 + green * 0.587 + blue * 0.114 > 186 ? colors.BLACK : '#ffffff';
};

export const TagStyle = (color: string) => css`
  ${borderRadiuses.MAIN};
  ${fontSizesWithHeights.MAIN};
  ${presets.ELLIPSIS};
  ${layout.HORIZONTAL};
  ${layout.CENTER};
  background-color: ${color};
  padding: 0 5px;
  font-weight: bold;
  color: ${computeTextColor(color)};
  height: min-content;
  width: min-content;
  user-select: none;
`;

export const PrefixStyle = (color: string) => css`
  color: ${computeTextColor(color)};
  ${fontSizes.MEDIUM};
  font-weight: bold;
  margin-right: 3px;
  * {
    ${layout.HORIZONTAL};
    ${layout.CENTER};
  }
`;

export const SuffixStyle = (color: string) => css`
  color: ${computeTextColor(color)};
  ${fontSizes.MEDIUM};
  font-weight: bold;
  margin-left: 3px;
  * {
    ${layout.HORIZONTAL};
    ${layout.CENTER};
  }
`;
