// @flow
import { css } from 'react-emotion';
import { layout, colors } from 'styles/common';

export const AutoDateWrapperStyle: string = css`
  position: relative;
  ${layout.GRID_VERTICAL};
  grid-gap: 10px;
`;

export const DateBindingSignWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 10px;
`;

export const BindingToggleButtonStyle = css`
  position: absolute;
  right: -60px;
`;

export const IconStyle: string = css`
  width: 30px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  color: ${colors.GRAY_LIGHT};
`;
