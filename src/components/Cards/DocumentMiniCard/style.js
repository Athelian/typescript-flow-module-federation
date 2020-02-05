// @flow
import { css } from 'react-emotion';
import { layout, colors, presets, borderRadiuses, fontSizes } from 'styles/common';

export const DocumentMiniCardWrapperStyle = css`
  ${layout.GRID_VERTICAL};
  position: relative;
  grid-template-columns: 195px;
  grid-gap: 5px;
  width: 195px;
  height: 109px;
  padding: 10px 0;
`;

export const FileExtensionIconStyle = (color: string): string => css`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
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

export const StatusAndButtonsWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 5px;
  justify-content: center;
`;

export const DownloadButtonStyle = (isDisabled: boolean): string => css`
  ${presets.BUTTON};
  width: 30px;
  height: 30px;
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
