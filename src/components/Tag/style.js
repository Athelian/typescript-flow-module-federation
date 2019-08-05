// @flow
import { css } from 'react-emotion';
import { presets, layout, fontSizes, borderRadiuses, fontSizesWithHeights } from 'styles/common';
import { computeTextColor } from 'utils/color';

export const TagStyle = (color: string): string => css`
  ${borderRadiuses.MAIN};
  ${fontSizesWithHeights.SMALL};
  ${presets.ELLIPSIS};
  ${layout.HORIZONTAL};
  ${layout.CENTER};
  display: inline-flex;
  background-color: ${color};
  padding: 0 5px;
  font-weight: bold;
  color: ${computeTextColor(color)};
  height: min-content;
  width: min-content;
  user-select: none;
  flex-shrink: 0;
`;

export const PrefixStyle = (color: string): string => css`
  color: ${computeTextColor(color)};
  ${fontSizes.MEDIUM};
  font-weight: bold;
  margin-right: 3px;
  * {
    ${layout.HORIZONTAL};
    ${layout.CENTER};
  }
`;

export const SuffixStyle = (color: string): string => css`
  color: ${computeTextColor(color)};
  ${fontSizes.MEDIUM};
  font-weight: bold;
  margin-left: 3px;
  * {
    ${layout.HORIZONTAL};
    ${layout.CENTER};
  }
`;
