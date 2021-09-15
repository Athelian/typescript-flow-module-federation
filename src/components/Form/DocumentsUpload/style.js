// @flow
import { css } from 'react-emotion';
import {
  presets,
  colors,
  borderRadiuses,
  fontSizes,
  scrollbars,
  transitions,
  shadows,
  layout,
} from 'styles/common';

export const DocumentsDragAndDropTooltipWrapperStyle: string = css`
  ${presets.BUTTON};
  ${fontSizes.LARGE};
  color: ${colors.GRAY};
  width: 50px;
  height: 50px;
  cursor: default;
  &:hover {
    color: ${colors.GRAY_DARK};
  }
`;

export const NavContentRightContainer: string = css`
  display: flex;
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  align-items: center;
`;

export const NavContentRightContainerButtons: string = css`
  display: flex;
  height: 100%;
  align-items: center;
`;

export const DocumentsUploadWrapperStyle: string = css`
  ${layout.GRID_VERTICAL};
  grid-gap: 10px;
  padding: 10px;
`;

export const DocumentsDragAndDropBodyWrapperStyle: string = css`
  position: relative;
  width: 100%;
  height: min-content;
`;

export const DocumentsSectionBodyStyle: string = css`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 500px;
  overflow-x: hidden;
  overflow-y: overlay;
  ${scrollbars.SMALL};
  padding: 30px 20px;
`;

export const DocumentsDragAndDropWrapperStyle = (isDragActive: boolean): string => css`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  letter-spacing: 2px;
  align-items: center;
  justify-content: center;
  ${borderRadiuses.MAIN};
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  ${transitions.MAIN};
  background-color: rgba(255, 255, 255, 0.9);
  border: 5px dashed ${colors.TEAL};
  ${isDragActive
    ? `
      visibility: visible;
      opacity: 1;
    `
    : `
      visibility: hidden;
      opacity: 0;
    `}
`;

export const DocumentsDragAndDropLabelStyle: string = css`
  padding: 10px;
  background-color: ${colors.TEAL};
  color: ${colors.WHITE};
  ${fontSizes.MAIN};
  letter-spacing: 2px;
  ${borderRadiuses.MAIN};
  ${shadows.FAINT};
  font-weight: bold;
`;

export const DocumentsListStyle: string = css`
  display: grid;
  grid-template-columns: repeat(auto-fit, 195px);
  grid-auto-rows: min-content;
  grid-gap: 30px 20px;
  width: 100%;
`;
export const DownloadWrapperStyle = css`
  position: relative;
`;

export const DownloadDropDownStyle = css`
  position: absolute;
  top: 40px;
  display: flex;
  flex-direction: column;
  ${shadows.INPUT};
  background: ${colors.WHITE};
  ${borderRadiuses.MAIN};
  overflow: visible;
  min-width: 100px;

  &:after {
    content: '';
    position: absolute;
    border: 1px solid rgba(51, 51, 51, 0.19);
    border-color: white transparent;
    border-width: 0 10px 9px 10px;
    top: -9px;
    left: 5%;
  }

  &:before {
    content: '';
    position: absolute;
    border: 1px solid #333;
    border-color: #999 transparent;
    border-width: 0 10px 9px 10px;
    top: -9px;
    left: 5%;
  }
`;

export const DownloadItemStyle = css`
  ${presets.BUTTON};
  justify-content: left;
  height: 30px;
  padding: 15px;
  padding-left: 10px;
  ${fontSizes.MEDIUM};
  color: ${colors.GRAY_DARK};
  white-space: nowrap;
  &:hover,
  :focus {
    background-color: ${colors.GRAY_SUPER_LIGHT};
  }
`;

export const DownloadItemIconStyle = css`
  margin: 0 5px 0 0;
  ${fontSizes.SMALL};
`;
