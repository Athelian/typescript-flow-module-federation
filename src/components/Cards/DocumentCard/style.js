// @flow
import { css } from 'react-emotion';
import { layout, colors, presets, borderRadiuses, fontSizes } from 'styles/common';

export const DocumentCardWrapperStyle = (cardHeight: string): string => css`
  ${layout.GRID_VERTICAL};
  position: relative;
  grid-gap: 5px;
  width: 195px;
  height: ${cardHeight};
  padding: 10px 5px;
`;

export const FileExtensionIconStyle = (color: string): string => css`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  font-size: 36px;
  color: ${colors[color]};
`;

export const FileNameWrapperStyle: string = css`
  display: flex;
  overflow: hidden;
  ${fontSizes.MAIN};
  color: ${colors.BLACK};
  font-weight: bold;
  align-items: center;
  flex: 1;
  padding: 0 5px;
  margin: 5px 0 0 0;
  height: 20px;
  line-height: 20px;
`;

export const FileNameStyle: string = css`
  ${presets.ELLIPSIS};
`;

export const DocumentTypeStyle: string = css`
  padding: 0 5px;
  ${borderRadiuses.MAIN};
  background: ${colors.GRAY_SUPER_LIGHT};
  ${fontSizes.MAIN};
  color: ${colors.BLACK};
  font-weight: bold;
  ${presets.ELLIPSIS};
  margin: 0 5px;
  height: 20px;
  line-height: 20px;
`;

export const DocumentParentWrapperStyle: string = css`
  padding: 0 5px;
`;

export const CreatedAtStyle: string = css`
  color: ${colors.BLACK};
  ${fontSizes.SMALL};
  line-height: 20px;
  padding: 0 5px 0 0;
`;

export const TagsAndButtonsWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 5px;
  padding: 0 5px;
`;

export const TagsWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 5px;
  overflow: hidden;
  width: 152px;
  ${borderRadiuses.MAIN};
`;

export const DownloadButtonStyle = (isDisabled: boolean): string => css`
  ${presets.BUTTON};
  width: 18px;
  height: 18px;
  ${fontSizes.MAIN};
  ${isDisabled
    ? `
    color: ${colors.GRAY_SUPER_LIGHT};
    cursor: default;
  `
    : `
    color: ${colors.GRAY_LIGHT};
    &:hover {
      color: ${colors.TEAL};
    }
  `};
`;
