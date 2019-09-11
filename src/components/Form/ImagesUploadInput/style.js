// @flow
import { css } from 'react-emotion';
import {
  layout,
  presets,
  colors,
  borderRadiuses,
  scrollbars,
  transitions,
  fontSizes,
  shadows,
} from 'styles/common';

type AddImageProps = {
  width: string,
  height: string,
};

export const FileListStyle: string = css`
  display: grid;
  grid-template-columns: repeat(auto-fit, 140px);
  grid-auto-rows: min-content;
  grid-gap: 20px;
`;

export const AddImageStyle = ({ width, height }: AddImageProps): string => css`
  ${presets.BUTTON};
  ${borderRadiuses.MAIN};
  font-size: 30px;
  color: ${colors.GRAY_LIGHT};
  width: ${width};
  height: ${height};
  border: 5px dashed ${colors.GRAY_SUPER_LIGHT};
  &:hover,
  :focus {
    color: ${colors.TEAL};
    border-color: ${colors.TEAL};
    background-color: ${colors.GRAY_SUPER_LIGHT};
  }
`;

export const UploadWrapperStyle = css`
  display: flex;
`;

export const ProgressStyle = css`
  ${presets.BOX};
  ${layout.LAYOUT};
  ${layout.CENTER_CENTER};
  width: 180px;
  height: 180px;
  color: ${colors.TEAL};
  font-size: 24px;
  margin-right: 20px;
`;

export const DocumentsSectionBodyStyle: string = css`
  position: relative;
  display: flex;
  flex-direction: column;
  ${borderRadiuses.MAIN};
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  background-color: ${colors.GRAY_SUPER_LIGHT};
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
