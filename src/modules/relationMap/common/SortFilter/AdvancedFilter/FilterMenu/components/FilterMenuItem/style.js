// @flow
import { css } from 'react-emotion';
import { presets, colors, fontSizesWithHeights } from 'styles/common';

export const FilterMenuItemWrapperStyle = (isActive: boolean): string => css`
  ${presets.BUTTON};
  ${isActive
    ? `
      background-color: ${colors.WHITE};
      color: ${colors.TEAL};
    `
    : `
      color: ${colors.BLACK};
    `};
`;

export const FilterMenuItemStyle: string = css`
  display: grid;
  grid-template-columns: 40px 1fr;
  grid-template-rows: 40px;
  width: 100%;
  height: 40px;
  flex-shrink: 0;
  align-items: center;
`;

export const FilterMenuLabelStyle: string = css`
  ${fontSizesWithHeights.SMALL};
  letter-spacing: 2px;
  ${presets.ELLIPSIS};
`;
