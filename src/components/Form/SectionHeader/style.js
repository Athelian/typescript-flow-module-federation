// @flow
import { css } from 'react-emotion';
import { presets, colors, fontSizes, layout } from 'styles/common';

export const SectionHeaderWrapperStyle: string = css`
  position: relative;
  grid-template-columns: 1fr;
  ${layout.GRID_HORIZONTAL};
  grid-template-rows: 40px;
  grid-gap: 20px;
  align-items: center;
  width: 100%;
`;

export const TitleWrapperStyle: string = css`
  position: relative;
  display: flex;
  align-items: center;
  ${fontSizes.LARGE};
  color: ${colors.GRAY_DARK};
  text-transform: uppercase;
`;

export const TitleStyle: string = css`
  ${presets.ELLIPSIS};
  font-weight: bold;
  letter-spacing: 2px;
  user-select: none;
`;

export const IconStyle: string = css`
  position: absolute;
  left: -40px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;
