// @flow
import { css } from 'react-emotion';
import { presets, colors, shadows, borderRadiuses, fontSizes, transitions } from 'styles/common';

export const DocumentWrapperStyle = (isExpanded: boolean) => css`
  position: relative;
  display: flex;
  ${isExpanded && 'grid-column: 1 / -1'};
  ${borderRadiuses.MAIN};
`;

export const DocumentCardStyle = css`
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

export const FileExtensionIconStyle = (color: string) => css`
  font-size: 40px;
  text-align: center;
  color: ${colors[color]};
  margin: 15px 0 5px 0;
`;

export const BottomWrapperStyle = css`
  display: flex;
  justify-content: space-between;
`;

export const FileNameWrapperStyle = css`
  display: flex;
  overflow: hidden;
  ${fontSizes.MEDIUM};
  color: ${colors.GRAY_DARK};
  justify-content: center;
  align-items: center;
  width: 100%;
`;

export const FileNameStyle = css`
  ${presets.ELLIPSIS};
`;

export const DownloadButtonStyle = css`
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

export const DeleteButtonStyle = css`
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

export const MemoWrapperStyle = (isExpanded: boolean) => css`
  position: relative;
  ${presets.BOX};
  width: ${isExpanded ? '100%' : '0px'};
  ${transitions.EXPAND};
  overflow: hidden;
  margin: 0 0 0 10px;
  & > div {
    margin: 20px;
  }
`;

export const OpenMemoButtonStyle = (isExpanded: boolean, hasMemo: boolean) => css`
  position: absolute;
  ${presets.BUTTON};
  ${borderRadiuses.CIRCLE};
  width: 40px;
  height: 40px;
  right: -10px;
  top: 60px;
  ${shadows.NAV_BUTTON};
  border: 2px solid transparent;
  ${hasMemo
    ? `
      background-color: ${colors.TEAL};
      color: #fff;
      &:focus {
        border-color: #fff;
      }
    `
    : `
      background-color: #fff;
      color: ${colors.TEAL};
      &:focus {
        border-color: ${colors.TEAL}
      }
    `};
  ${isExpanded
    ? `
      color: ${colors.GRAY_LIGHT};
      background-color: #fff;
      right: -20px;
      &:focus {
        border-color: ${colors.TEAL};
      }
      &:hover {
        color: ${colors.TEAL};
        ${shadows.NAV_BUTTON_HOVER};
      }
    `
    : `
      justify-content: flex-end;
      padding-right: 10px;
      &:hover {
        right: -20px;
        padding-right: 7px;
      }
    `};
`;
