// @flow
import { css } from 'react-emotion';
import { layout, presets, colors, borderRadiuses } from 'styles/common';

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
