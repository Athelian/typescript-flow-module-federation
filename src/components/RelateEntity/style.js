// @flow
import { css } from 'react-emotion';
import { layout, colors } from 'styles/common';

export const WrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  grid-template-columns: 20px 145px;
  grid-gap: 5px;
  width: fit-content;
`;

export const IconColorStyle = (entity: string, isNotAvailable: boolean) => css`
  background-color: ${isNotAvailable ? colors.GRAY_VERY_LIGHT : colors[entity]};
  width: 20px;
  height: 20px;
  font-size: 11px;
  display: flex;
  border-top-right-radius: 5px;
  border-bottom-left-radius: 5px;
  color: #fff;
  ${layout.CENTER_CENTER};
`;
