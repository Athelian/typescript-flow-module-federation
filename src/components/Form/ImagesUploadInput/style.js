// @flow
import { css } from 'react-emotion';
import { layout, presets, colors, borderRadiuses } from 'styles/common';

export const UploadWrapperStyle = css`
  display: flex;
`;

type AddImageProps = {
  width: string,
  height: string,
  isDragActive: boolean,
};

export const AddImageStyle = ({ width, height, isDragActive }: AddImageProps): string => css`
  ${presets.BUTTON};
  ${borderRadiuses.MAIN};
  font-size: 30px;
  width: ${width};
  height: ${height};
  ${isDragActive
    ? `
    color: ${colors.TEAL};
    border: 5px dashed ${colors.TEAL};
    background-color: ${colors.GRAY_SUPER_LIGHT};
  `
    : `
    color: ${colors.GRAY_LIGHT};
    border: 5px dashed ${colors.GRAY_SUPER_LIGHT};
    &:hover,
    :focus {
      color: ${colors.TEAL};
      border-color: ${colors.TEAL};
      background-color: ${colors.GRAY_SUPER_LIGHT};
    }
  `};
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
