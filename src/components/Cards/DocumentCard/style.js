// @flow
import { css } from 'react-emotion';
import { layout, colors, presets, borderRadiuses, fontSizes } from 'styles/common';

export const DocumentCardWrapperStyle = (cardHeight: string): string => css`
  ${layout.GRID_VERTICAL};
  position: relative;
  grid-template-columns: 195px;
  grid-gap: 5px;
  width: 195px;
  height: ${cardHeight};
  padding: 10px 0 0 0;
`;

export const DocumentParentWrapperStyle: string = css`
  display: flex;
  padding: 0 10px;
`;

export const DocumentTypeStyle: string = css`
  padding: 0 5px;
  & > div > div {
    border-radius: 5px;
    background: ${colors.GRAY_SUPER_LIGHT};
  }
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
  ${fontSizes.MEDIUM};
  color: ${colors.GRAY_DARK};
  justify-content: center;
  align-items: center;
  flex: 1;
  padding: 0 10px;
  height: 30px;
  line-height: 30px;
`;

export const FileNameStyle: string = css`
  ${presets.ELLIPSIS};
`;

export const DownloadButtonStyle = (isDisabled: boolean): string => css`
  ${presets.BUTTON};
  width: 18px;
  height: 18px;
  ${fontSizes.MAIN};
  ${borderRadiuses.CIRCLE};
  ${isDisabled
    ? `
    color: ${colors.GRAY_SUPER_LIGHT};
    cursor: default;
  `
    : `
    color: ${colors.GRAY_LIGHT};
    &:hover {
      color: ${colors.TEAL};
      background-color: ${colors.GRAY_SUPER_LIGHT};
    }
  `};
`;

export const TagsAndButtonsWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 5px;
  justify-content: center;
`;

export const TagsWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 5px;
  overflow: hidden;
  width: 155px;
  padding: 0 0 0 5px;
  ${borderRadiuses.MAIN};
`;
