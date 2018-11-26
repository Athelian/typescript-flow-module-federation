// @flow
import { css } from 'react-emotion';
import { scrollbars, layout, colors, fontSizes } from 'styles/common';

export const MiniSelectorWrapperStyle: string = css`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

export const MiniSelectorSearchWrapperStyle: string = css`
  width: 100%;
  padding: 20px 20px 0 20px;
  ${layout.GRID_HORIZONTAL};
  grid-gap: 20px;
  justify-content: end;
  align-items: center;
`;

export const MiniSelectorStatusTogglesWrapperStyle: string = css`
  display: flex;
  align-items: center;
  color: ${colors.GRAY_LIGHT};
  ${fontSizes.MAIN};
`;

export const MiniSelectorBodyWrapperStyle: string = css`
  width: 100%;
  height: 250px;
  overflow-x: hidden;
  overflow-y: auto;
  ${scrollbars.SMALL};
  padding: 0 20px 20px 20px;
`;
