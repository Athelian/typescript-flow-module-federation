// @flow
import { css } from 'react-emotion';
import { presets, colors, shadows, borderRadiuses, fontSizes } from 'styles/common';

export const ImageWrapperStyle = (isExpanded: boolean): string => css`
  position: relative;
  display: flex;
  ${isExpanded && 'grid-column: 1 / -1'};
  ${borderRadiuses.MAIN};
`;

export const ImageCardStyle: string = css`
  ${presets.BOX};
  display: grid;
  grid-template-columns: 120px;
  grid-auto-rows: min-content;
  align-content: space-between;
  width: 140px;
  height: 160px;
  padding: 10px;
  z-index: 1;
`;

export const FileExtensionIconStyle = (color: string): string => css`
  font-size: 40px;
  text-align: center;
  color: ${colors[color]};
  margin: 15px 0 5px 0;
`;

export const BottomWrapperStyle: string = css`
  display: flex;
  justify-content: space-between;
`;

export const FileNameWrapperStyle: string = css`
  display: flex;
  overflow: hidden;
  ${fontSizes.MEDIUM};
  color: ${colors.GRAY_DARK};
  justify-content: center;
  align-items: center;
  width: 100%;
`;

export const FileNameStyle: string = css`
  ${presets.ELLIPSIS};
`;

export const DownloadButtonStyle: string = css`
  ${presets.BUTTON};
  ${borderRadiuses.CIRCLE};
  background-color: #fff;
  color: ${colors.GRAY_DARK};
  border: 2px solid transparent;
  height: 30px;
  width: 30px;
  ${fontSizes.MEDIUM};
  flex-shrink: 0;
  margin: 0 0 0 5px;
  &:hover {
    background-color: ${colors.GRAY_VERY_LIGHT};
    color: ${colors.TEAL};
  }
  &:focus {
    border-color: ${colors.TEAL};
  }
`;

export const DeleteButtonStyle: string = css`
  ${presets.BUTTON};
  ${borderRadiuses.CIRCLE};
  ${shadows.NAV_BUTTON};
  ${fontSizes.MAIN};
  position: absolute;
  top: -12.5px;
  right: -12.5px;
  background-color: #fff;
  color: ${colors.GRAY_LIGHT};
  height: 25px;
  width: 25px;
  z-index: 2;
  &:hover {
    ${shadows.NAV_BUTTON_HOVER};
    color: ${colors.RED};
  }
  &:focus {
    color: ${colors.RED};
    border: 1px solid ${colors.RED};
  }
`;
