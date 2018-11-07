// @flow
import { css } from 'react-emotion';
import { layout, fontSizes, colors, presets } from 'styles/common';

export const FormHeaderWrapperStyle: string = css`
  position: relative;
  grid-template-columns: 1fr;
  ${layout.GRID_HORIZONTAL};
  grid-template-rows: 40px;
  grid-gap: 20px;
  align-items: center;
`;

export const TitleStyle: string = css`
  position: relative;
  display: flex;
  align-items: center;
  ${fontSizes.LARGE};
  color: ${colors.GRAY_DARK};
  ${presets.ELLIPSIS};
  letter-spacing: 2px;
  user-select: none;
`;
