// @flow
import { css } from 'react-emotion';
import { layout, colors } from 'styles/common';

export const SummaryWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 100px;
  grid-template-columns: repeat(2, 1fr);
`;

export const LeftPartWrapperStyle: string = css`
  ${layout.GRID_HORIZONTAL};
  grid-gap: 100px;
  grid-template-columns: repeat(3, 1fr);
`;

export const BlueStyle: string = css`
  color: ${colors.BLUE};
`;

export const GrayLightStyle: string = css`
  color: ${colors.GRAY_LIGHT};
`;

export const TealStyle: string = css`
  color: ${colors.TEAL};
`;
