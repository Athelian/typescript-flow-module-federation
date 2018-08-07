// @flow
import { css } from 'react-emotion';
import {
  presets,
  colors,
  borderRadiuses,
  fontSizesWithHeights,
  layout,
  transitions,
} from 'styles/common';
// import { computeTextColor } from 'src/components/UI/Tag/style';

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

export const ProductItemStyle = css`
  ${layout.VERTICAL};
`;

export const ImageStyle = css`
  border-radius: 2px 2px 0 0;
  height: 100px;
  width: 200px;
  object-fit: cover;
  overflow: hidden;
  background-color: #ccc;
  user-select: none;
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

export const NameStyle = css`
  ${presets.ELLIPSIS};
  ${fontSizesWithHeights.LARGE};
  color: ${colors.BLACK};
  padding: 0 10px;
  width: 200px;
  margin: 5px 0 0 0;
`;

export const SerialStyle = css`
  ${presets.ELLIPSIS};
  ${fontSizesWithHeights.SMALL};
  color: ${colors.GRAY_DARK};
  padding: 0 10px;
  margin: 0 0 5px 0;
  width: 200px;
`;

export const ExporterStyle = css`
  ${presets.ELLIPSIS};
  ${fontSizesWithHeights.MEDIUM};
  color: ${colors.BLACK};
  padding: 0 10px;
  font-weight: bold;
  width: 200px;
`;

export const SupplierStyle = css`
  ${presets.ELLIPSIS};
  ${fontSizesWithHeights.MEDIUM};
  color: ${colors.BLACK};
  padding: 0 10px;
  font-weight: bold;
  width: 200px;
`;

export const IconStyle = css`
  color: ${colors.GRAY_DARK};
`;

export const MoreStyle = css`
  font-size: 8px;
  color: ${colors.GRAY};
  transform: translate(-3px, -6px);
`;

export const HiddenStyle = css`
  visibility: hidden;
`;

export const CopyButtonWrapperStyle = css`
  position: absolute;
  right: 10px;
  top: 10px;
  opacity: 0;
  ${transitions.MAIN};
`;

export const ProductItemWrapperStyle = css`
  position: relative;
  &:hover {
    & > div:nth-child(2) {
      opacity: 1;
    }
  }
`;
