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
} from 'styles/common';

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

export const DocumentsDragAndDropTooltipWrapperStyle: string = css`
  ${presets.BUTTON};
  position: absolute;
  right: 0;
  top: 0;
  ${fontSizes.LARGE};
  color: ${colors.GRAY};
  width: 30px;
  height: 30px;
  cursor: default;
  &:hover {
    color: ${colors.GRAY_DARK};
    text-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  }
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

export const AddDocumentButtonWrapperStyle: string = css`
  ${presets.BUTTON};
  color: ${colors.WHITE};
  background-color: ${colors.TEAL};
  ${borderRadiuses.BUTTON};
  height: 30px;
  padding: 0 10px;
  width: min-content;
  min-width: 75px;
  flex-shrink: 0;
  &:hover,
  :focus {
    background-color: ${colors.TEAL_DARK};
  }
`;

export const AddDocumentButtonLabelStyle: string = css`
  ${presets.ELLIPSIS};
  letter-spacing: 2px;
  ${fontSizes.SMALL};
  text-transform: uppercase;
`;

export const AddDocumentButtonIconStyle: string = css`
  margin: 0 0 0 5px;
  ${fontSizes.SMALL};
`;

export const NoDocumentsStyle: string = css`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
  width: 100%;
  ${fontSizes.MAIN};
  color: ${colors.BLACK};
  font-weight: bold;
  text-align: center;
`;
