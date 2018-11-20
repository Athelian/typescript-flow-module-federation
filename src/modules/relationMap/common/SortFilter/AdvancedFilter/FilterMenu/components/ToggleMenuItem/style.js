// @flow
import { css } from 'react-emotion';
import { presets, colors, fontSizesWithHeights } from 'styles/common';

export const ToggleMenuItemWrapperStyle: string = css`
  display: grid;
  grid-template-columns: 40px 1fr 40px;
  grid-template-rows: 40px;
  align-items: center;
  height: 40px;
  width: 100%;
  flex-shrink: 0;
`;

export const ToggleMenuIconStyle: string = css`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.GRAY_LIGHT};
`;

export const ToggleMenuLabelStyle: string = css`
  ${fontSizesWithHeights.SMALL};
  letter-spacing: 2px;
  ${presets.ELLIPSIS};
  text-align: left;
  color: ${colors.GRAY_DARK};
  user-select: none;
`;
