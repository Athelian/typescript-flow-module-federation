// @flow
import { css } from 'react-emotion';
import { presets, layout, fontSizes, borderRadiuses, fontSizesWithHeights } from 'styles/common';
import { computeTextColor } from 'components/Tag/style';

export const TagStyle = (color: string) => css`
  ${borderRadiuses.MAIN};
  ${fontSizesWithHeights.MAIN};
  ${presets.ELLIPSIS};
  ${layout.HORIZONTAL};
  ${layout.CENTER};
  background-color: ${color};
  padding: 3px 5px;
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
`;

export const SuffixStyle = (color: string) => css`
  color: ${computeTextColor(color)};
  ${fontSizes.MEDIUM};
  font-weight: bold;
  margin-left: 3px;
`;
