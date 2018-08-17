// @flow
import { css } from 'react-emotion';
import { presets, colors, layout, fontSizesWithHeights, borderRadiuses } from 'styles/common';
import { computeTextColor } from 'components/Tag/style';

export const NameStyle = css`
  ${presets.ELLIPSIS};
  ${fontSizesWithHeights.LARGE};
  color: #555;
  margin: 10px 0 0 0;
  padding: 0 10px;
  width: 200px;
`;

export const EmailStyle = css`
  ${presets.ELLIPSIS};
  ${fontSizesWithHeights.SMALL};
  color: ${colors.GRAY_DARK};
  padding: 0 10px;
  margin: 0 0 5px 0;
  width: 200px;
`;

export const SubFieldStyle = css`
  ${presets.ELLIPSIS};
  ${fontSizesWithHeights.MEDIUM};
  color: ${colors.BLACK};
  padding: 0 10px;
  & > svg {
    margin: 0 5px 0 0;
  }
`;

export const IconStyle = css`
  color: ${colors.GRAY_DARK};
`;

export const TagsWrapperStyle = css`
  ${borderRadiuses.MAIN};
  height: 18px;
  margin: 5px 10px 10px 10px;
  display: flex;
  align-items: center;
  width: 180px;
  overflow: hidden;
`;

export const TagStyle = (color: string) => css`
  ${borderRadiuses.MAIN};
  ${fontSizesWithHeights.SMALL};
  ${presets.ELLIPSIS};
  ${layout.HORIZONTAL};
  ${layout.CENTER};
  background-color: ${color};
  padding: 0 4px;
  font-weight: bold;
  margin: 0 5px 0 0;
  color: ${computeTextColor(color)};
  height: min-content;
  width: min-content;
  user-select: none;
  flex-shrink: 0;
`;
