// @flow
import { css } from 'react-emotion';
import { layout, presets, colors, borderRadiuses, fontSizes } from 'styles/common';

type AddImageProps = {
  width: string,
  height: string,
};

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

export const ProgressStyle = ({ width, height }: AddImageProps): string => css`
  ${presets.BOX};
  ${layout.LAYOUT};
  ${layout.CENTER_CENTER};
  width: ${width};
  height: ${height};
  color: ${colors.TEAL};
  ${fontSizes.MAIN};
  font-weight: bold;
  ${presets.ELLIPSIS};
`;
