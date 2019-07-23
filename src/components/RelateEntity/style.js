// @flow
import { css } from 'react-emotion';
import { layout, colors, fontSizes, borderRadiuses, presets } from 'styles/common';

export const WrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  grid-template-columns: 25px 145px;
  grid-gap: 5px;
  width: fit-content;
`;

export const IconColorStyle = (entity: string, isNotAvailable: boolean) => css`
  background-color: ${isNotAvailable ? colors.GRAY_VERY_LIGHT : colors[entity]};
  width: 25px;
  height: 25px;
  color: #fff;
  display: flex;
  border-top-right-radius: 5px;
  border-bottom-left-radius: 5px;
  ${layout.CENTER_CENTER};
`;

export const TextStyle = css`
  ${borderRadiuses.MAIN};
  ${presets.ELLIPSIS};
  ${fontSizes.MAIN};
  line-height: 25px;
  padding-left: 4px;
  color: #000;
`;

export default WrapperStyle;
