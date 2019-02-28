// @flow
import { css } from 'react-emotion';
import { layout, colors, shadows, fontSizes } from 'styles/common';

export const SplitPanelWrapperStyle: string = css`
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px 0 20px;
  background-color: ${colors.TEAL_LIGHT};
  ${shadows.HEADER};
  z-index: 1;
`;

export const SplitOptionsWrapperStyle: string = css`
  display: flex;
`;

export const SplitLabelWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  align-items: center;
  color: ${colors.TEAL_DARK};
  ${fontSizes.SMALL};
  margin: 0 20px 0 0;
`;

export const SplitActionWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 20px;
`;
