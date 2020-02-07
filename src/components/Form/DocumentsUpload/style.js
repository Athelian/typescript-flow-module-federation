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
  position: absolute;
  right: 0;
  top: 0;
  ${fontSizes.LARGE};
  color: ${colors.GRAY};
  width: 50px;
  height: 50px;
  cursor: default;
  &:hover {
    color: ${colors.GRAY_DARK};
  }
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
