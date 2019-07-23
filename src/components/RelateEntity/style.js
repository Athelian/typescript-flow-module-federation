// @flow
import { css } from 'react-emotion';
import { layout, colors, borderRadiuses, shadows, presets } from 'styles/common';

export const WrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  grid-template-columns: 35px auto;
  grid-gap: 5px;
  width: fit-content;
`;

export const IconColorStyle = (entity: string) => css`
  background-color: ${colors[entity]};
  width: 35px;
  height: 35px;
  color: #fff;
  display: flex;
  border-top-right-radius: 5px;
  border-bottom-left-radius: 5px;
  ${layout.CENTER_CENTER};
`;

export const TextStyle = css`
  ${shadows.WATERFALL};
  ${borderRadiuses.MAIN};
  ${presets.ELLIPSIS};
  line-height: 35px;
  padding-left: 4px;
  background-color: #fff;
  color: #000;
`;

export default WrapperStyle;
