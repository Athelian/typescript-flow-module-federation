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
  justify-content: space-between;
  background-color: ${color};
  padding: 0 5px;
  font-weight: bold;
  color: ${computeTextColor(color)};
  height: min-content;
  width: min-content;
  user-select: none;
  flex-shrink: 0;
`;

export const OwnerStyle: string = css`
  font-size: 12px;
  height: 16px;
  width: 16px;
  background: #c4c4c4;
  border-radius: 50%;
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  &:empty {
    display: none;
  }
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
