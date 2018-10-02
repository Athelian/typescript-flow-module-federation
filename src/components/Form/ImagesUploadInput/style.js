// @flow
import { css } from 'react-emotion';
import { layout, presets, colors, borderRadiuses } from 'styles/common';

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

export const ProgressStyle: string = css`
  ${presets.BOX};
  ${layout.LAYOUT};
  ${layout.CENTER_CENTER};
  width: 140px;
  height: 160px;
  color: ${colors.TEAL};
  font-size: 24px;
`;
